import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Switch,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import CustomerPicker from "../../components/CustomerPicker";
import RoomPicker from "../../components/RoomPicker";
import { useBookingDetail, useBookingUpsert } from "../../hooks/useBookings";
import { useCustomerUpsert } from "../../hooks/useCustomers";

const STATUS_OPTIONS = [
  { value: "BOOKED", label: "Đặt phòng" },
  { value: "CHECKIN", label: "Check-in" },
  { value: "CHECKOUT", label: "Check-out" },
  { value: "CANCELED", label: "Huỷ" },
];

const fmtVND = (v) =>
  typeof v === "number"
    ? v.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    : "—";

export function UpsertFormTrigger({ id, children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>
      {open && (
        <UpsertForm id={id} open={open} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

function UpsertForm({ id, open, onClose }) {
  const isEdit = !!id;
  const queryClient = useQueryClient();
  const result = useBookingDetail(id);
  const { mutateAsync: mutateBooking, isPending: isBookingPending } = useBookingUpsert();
  const { mutateAsync: mutateCustomer, isPending: isCustomerPending } = useCustomerUpsert();
  const [createNewCustomer, setCreateNewCustomer] = useState(false);

  const isPending = isBookingPending || isCustomerPending;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customer_id: null,
      new_customer_name: "",
      new_customer_phone: "",
      notes: "",
      is_fully_paid: false,
      booking_details: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "booking_details",
  });

  const details = watch("booking_details");

  useEffect(() => {
    if (result.data) {
      reset({
        customer_id: result.data.customer_id,
        new_customer_name: "",
        new_customer_phone: "",
        notes: result.data.notes || "",
        is_fully_paid: result.data.is_fully_paid,
        booking_details: (result.data.booking_details ?? []).map((d) => ({
          _id: d.id,
          room_id: d.room_id,
          dateRange: [dayjs(d.checkin_date), dayjs(d.checkout_date)],
          price_per_night: d.price_per_night,
          status: d.status,
        })),
      });
    }
  }, [result.data]);

  const onSubmit = async (values) => {
    let customerId = values.customer_id;

    if (createNewCustomer) {
      try {
        const newCustomer = await mutateCustomer({
          name: values.new_customer_name,
          phone: Number(values.new_customer_phone),
        });
        customerId = newCustomer.id;
        queryClient.invalidateQueries({ queryKey: ["customers"] });
      } catch {
        message.error("Lỗi khi tạo khách hàng mới");
        return;
      }
    }

    const booking_details = values.booking_details.map((d) => {
      const [checkin, checkout] = d.dateRange ?? [];
      const nights = checkin && checkout ? checkout.diff(checkin, "day") : 0;
      const totalRoom = nights * (d.price_per_night || 0);
      const base = {
        room_id: d.room_id,
        checkin_date: checkin?.toISOString(),
        checkout_date: checkout?.toISOString(),
        quantity_of_nights: nights,
        price_per_night: d.price_per_night || 0,
        total_room_amount: totalRoom,
        total_service_amount: 0,
        total_amount: totalRoom,
        status: d.status || "BOOKED",
      };
      return isEdit ? base : { booking_id: 0, ...base };
    });

    try {
      await mutateBooking({
        id,
        customer_id: customerId,
        notes: values.notes || undefined,
        is_fully_paid: values.is_fully_paid,
        booking_details,
      });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onClose();
      message.success(isEdit ? "Cập nhật đặt phòng thành công" : "Tạo đặt phòng thành công");
    } catch {
      message.error(isEdit ? "Cập nhật thất bại" : "Tạo đặt phòng thất bại");
    }
  };

  const grandTotal = details.reduce((sum, d) => {
    const [c, o] = d?.dateRange ?? [];
    const nights = c && o ? o.diff(c, "day") : 0;
    return sum + nights * (d?.price_per_night || 0);
  }, 0);

  const colTemplate = isEdit
    ? "minmax(140px,2fr) minmax(180px,2.2fr) 52px minmax(110px,1.3fr) minmax(100px,1.3fr) minmax(120px,1.5fr) 32px"
    : "minmax(140px,2fr) minmax(180px,2.2fr) 52px minmax(110px,1.3fr) minmax(100px,1.3fr) 32px";

  return (
    <Modal
      open={open}
      title={isEdit ? "Chỉnh sửa đặt phòng" : "Thêm đặt phòng"}
      onCancel={onClose}
      onOk={handleSubmit(onSubmit)}
      okText={isEdit ? "Lưu" : "Tạo"}
      cancelText="Huỷ"
      okButtonProps={{ loading: isPending }}
      width={920}
    >
      <Form layout="vertical" style={{ paddingTop: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          {/* Customer field — picker OR inline create */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Form.Item
                label="Khách hàng"
                required
                validateStatus={
                  (!createNewCustomer && errors.customer_id) ||
                  (createNewCustomer && (errors.new_customer_name || errors.new_customer_phone))
                    ? "error"
                    : ""
                }
                style={{ flex: 1, marginBottom: 0 }}
              >
                {!createNewCustomer ? (
                  <Controller
                    name="customer_id"
                    control={control}
                    rules={{ required: "Bắt buộc" }}
                    render={({ field }) => (
                      <CustomerPicker {...field} style={{ width: "100%" }} />
                    )}
                  />
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <Controller
                      name="new_customer_name"
                      control={control}
                      rules={createNewCustomer ? { required: "Bắt buộc" } : {}}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Họ tên"
                          status={errors.new_customer_name ? "error" : ""}
                        />
                      )}
                    />
                    <Controller
                      name="new_customer_phone"
                      control={control}
                      rules={createNewCustomer ? { required: "Bắt buộc" } : {}}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="SĐT"
                          style={{ width: 120 }}
                          status={errors.new_customer_phone ? "error" : ""}
                        />
                      )}
                    />
                  </div>
                )}
              </Form.Item>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
              <Switch
                size="small"
                checked={createNewCustomer}
                onChange={setCreateNewCustomer}
              />
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                Tạo khách hàng mới
              </Typography.Text>
            </div>
          </div>

          <Form.Item label="Ghi chú">
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ghi chú (tuỳ chọn)" />
              )}
            />
          </Form.Item>
        </div>

        <Form.Item label="Đã thanh toán đầy đủ" style={{ marginBottom: 0 }}>
          <Controller
            name="is_fully_paid"
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onChange={field.onChange} />
            )}
          />
        </Form.Item>

        <Divider style={{ margin: "16px 0 12px" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <Typography.Text strong>Danh sách phòng đặt</Typography.Text>
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() =>
              append({ room_id: null, dateRange: null, price_per_night: 0, status: "BOOKED" })
            }
          >
            Thêm phòng
          </Button>
        </div>

        {fields.length > 0 && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: colTemplate,
                gap: 8,
                marginBottom: 6,
                padding: "0 2px",
              }}
            >
              {["Phòng", "Check-in → Check-out", "Đêm", "Giá/đêm", "Tổng phòng", ...(isEdit ? ["Trạng thái"] : []), ""].map(
                (h, i) => (
                  <Typography.Text key={i} type="secondary" style={{ fontSize: 12 }}>
                    {h}
                  </Typography.Text>
                ),
              )}
            </div>

            {fields.map((field, index) => {
              const dr = details[index]?.dateRange;
              const nights = dr?.[0] && dr?.[1] ? dr[1].diff(dr[0], "day") : 0;
              const total = nights * (details[index]?.price_per_night || 0);

              return (
                <div
                  key={field.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: colTemplate,
                    gap: 8,
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Controller
                    name={`booking_details.${index}.room_id`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <RoomPicker {...field} placeholder="Chọn phòng" style={{ width: "100%" }} />
                    )}
                  />
                  <Controller
                    name={`booking_details.${index}.dateRange`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <DatePicker.RangePicker
                        value={field.value}
                        onChange={field.onChange}
                        format="DD/MM/YYYY"
                        style={{ width: "100%" }}
                      />
                    )}
                  />
                  <Typography.Text style={{ textAlign: "center" }}>
                    {nights}
                  </Typography.Text>
                  <Controller
                    name={`booking_details.${index}.price_per_night`}
                    control={control}
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        style={{ width: "100%" }}
                        controls={false}
                        min={0}
                        formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        parser={(v) => v?.replace(/\./g, "") ?? "0"}
                      />
                    )}
                  />
                  <Typography.Text style={{ textAlign: "right", whiteSpace: "nowrap", fontSize: 13 }}>
                    {fmtVND(total)}
                  </Typography.Text>
                  {isEdit && (
                    <Controller
                      name={`booking_details.${index}.status`}
                      control={control}
                      render={({ field }) => (
                        <Select {...field} options={STATUS_OPTIONS} size="small" />
                      )}
                    />
                  )}
                  <Button
                    danger
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => remove(index)}
                  />
                </div>
              );
            })}

            <div style={{ textAlign: "right", marginTop: 8 }}>
              <Typography.Text strong>
                Tổng cộng: {fmtVND(grandTotal)}
              </Typography.Text>
            </div>
          </>
        )}

        {fields.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "20px 0",
              color: "#bbb",
              border: "1px dashed #e0e0e0",
              borderRadius: 6,
            }}
          >
            Chưa có phòng nào. Nhấn "Thêm phòng" để thêm.
          </div>
        )}
      </Form>
    </Modal>
  );
}
