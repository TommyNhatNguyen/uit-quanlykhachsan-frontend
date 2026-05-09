import { PlusOutlined } from "@ant-design/icons";
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
import MembershipPicker from "../../components/MembershipPicker";
import RoomPicker from "../../components/RoomPicker";
import { useBookingDetail, useBookingUpsert } from "../../hooks/useBookings";
import { useCustomerUpsert } from "../../hooks/useCustomers";
import useRooms from "../../hooks/useRooms";

const STATUS_OPTIONS = [
  { value: "BOOKED", label: "Đặt phòng" },
  { value: "CHECKIN", label: "Check-in" },
  { value: "CHECKOUT", label: "Check-out" },
  { value: "CANCELED", label: "Huỷ" },
];

const SEX_OPTIONS = [
  { label: "Nam", value: 1 },
  { label: "Nữ", value: 2 },
  { label: "Khác", value: 3 },
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
  const { mutateAsync: mutateBooking, isPending: isBookingPending } =
    useBookingUpsert();
  const { mutateAsync: mutateCustomer, isPending: isCustomerPending } =
    useCustomerUpsert();
  const [createNewCustomer, setCreateNewCustomer] = useState(false);

  const isPending = isBookingPending || isCustomerPending;

  const { data: roomsData } = useRooms({ pageSize: 1000 });
  const allRooms = roomsData?.data ?? [];

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customer_id: null,
      new_customer_name: "",
      new_customer_phone: null,
      new_customer_sex: null,
      new_customer_identification_id: "",
      new_customer_email: "",
      new_customer_birthday: null,
      new_customer_membership_type_id: null,
      notes: "",
      is_fully_paid: false,
      booking_details: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "booking_details",
    keyName: "_key",
  });
  const details = watch("booking_details");

  useEffect(() => {
    if (result.data) {
      reset({
        customer_id: result.data.customer_id,
        new_customer_name: "",
        new_customer_phone: null,
        new_customer_sex: null,
        new_customer_identification_id: "",
        new_customer_email: "",
        new_customer_birthday: null,
        new_customer_membership_type_id: null,
        notes: result.data.notes || "",
        is_fully_paid: result.data.is_fully_paid,
        booking_details: (result.data.booking_details ?? []).map((d) => ({
          ...d,
          id: d.id,
          room_id: d.room_id,
          dateRange: [dayjs(d.checkin_date), dayjs(d.checkout_date)],
          price_per_night: d.price_per_night,
          status: d.status,
        })),
      });
    }
  }, [result.data]);

  const onSubmit = async (values) => {
    if (!createNewCustomer) {
      if (!values.customer_id) {
        message.warning("Vui lòng chọn khách hàng");
        return;
      }
    } else {
      if (!values.new_customer_name) {
        message.warning("Vui lòng nhập họ tên khách hàng");
        return;
      }
      if (!values.new_customer_phone) {
        message.warning("Vui lòng nhập số điện thoại khách hàng");
        return;
      }
      if (!values.new_customer_sex) {
        message.warning("Vui lòng chọn giới tính");
        return;
      }
      if (!values.new_customer_identification_id) {
        message.warning("Vui lòng nhập CCCD / Hộ chiếu");
        return;
      }
    }

    let customerId = values.customer_id;

    if (createNewCustomer) {
      try {
        const newCustomer = await mutateCustomer({
          name: values.new_customer_name,
          phone: values.new_customer_phone,
          sex: values.new_customer_sex,
          identification_id: values.new_customer_identification_id,
          email: values.new_customer_email || null,
          birthday: values.new_customer_birthday
            ? values.new_customer_birthday.toISOString()
            : null,
          membership_type_id: values.new_customer_membership_type_id || null,
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
      return isEdit
        ? { id: d.id, booking_id: d.booking_id, ...base }
        : { booking_id: 0, ...base };
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
      message.success(
        isEdit ? "Cập nhật đặt phòng thành công" : "Tạo đặt phòng thành công",
      );
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
        {/* ── Customer row ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 16px",
          }}
        >
          <Form.Item
            label="Khách hàng"
            required={!createNewCustomer}
            validateStatus={
              !createNewCustomer && errors.customer_id ? "error" : ""
            }
            help={!createNewCustomer ? errors.customer_id?.message : undefined}
          >
            <Controller
              name="customer_id"
              control={control}
              render={({ field }) =>
                createNewCustomer ? (
                  <CustomerPicker
                    {...field}
                    disabled
                    style={{ width: "100%" }}
                  />
                ) : (
                  <CustomerPicker {...field} style={{ width: "100%" }} />
                )
              }
            />
          </Form.Item>

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

        {/* Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <Switch
            size="small"
            checked={createNewCustomer}
            onChange={(val) => {
              setCreateNewCustomer(val);
              if (val) clearErrors("customer_id");
            }}
          />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Tạo khách hàng mới
          </Typography.Text>
        </div>

        {/* ── New customer fields ── */}
        {createNewCustomer && (
          <div
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              padding: "12px 16px",
              marginBottom: 12,
              background: "#fafafa",
            }}
          >
            <Typography.Text
              strong
              style={{ display: "block", marginBottom: 12 }}
            >
              Thông tin khách hàng mới
            </Typography.Text>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0 16px",
              }}
            >
              <Form.Item
                label="Họ tên"
                required
                validateStatus={errors.new_customer_name ? "error" : ""}
                help={errors.new_customer_name?.message}
              >
                <Controller
                  name="new_customer_name"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="VD: Nguyễn Văn A" />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                required
                validateStatus={errors.new_customer_phone ? "error" : ""}
                help={errors.new_customer_phone?.message}
              >
                <Controller
                  name="new_customer_phone"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      placeholder="VD: 0909090909"
                      controls={false}
                      style={{ width: "100%" }}
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="Giới tính"
                required
                validateStatus={errors.new_customer_sex ? "error" : ""}
                help={errors.new_customer_sex?.message}
              >
                <Controller
                  name="new_customer_sex"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={SEX_OPTIONS}
                      placeholder="Chọn giới tính"
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="CCCD / Hộ chiếu"
                required
                validateStatus={
                  errors.new_customer_identification_id ? "error" : ""
                }
                help={errors.new_customer_identification_id?.message}
              >
                <Controller
                  name="new_customer_identification_id"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="VD: 012345678901" />
                  )}
                />
              </Form.Item>

              <Form.Item label="Email">
                <Controller
                  name="new_customer_email"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="VD: example@email.com" />
                  )}
                />
              </Form.Item>

              <Form.Item label="Ngày sinh">
                <Controller
                  name="new_customer_birthday"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      style={{ width: "100%" }}
                      format="DD/MM/YYYY"
                      placeholder="Chọn ngày sinh"
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="Hạng thành viên"
                style={{ gridColumn: "1 / -1" }}
              >
                <Controller
                  name="new_customer_membership_type_id"
                  control={control}
                  render={({ field }) => (
                    <MembershipPicker {...field} style={{ width: "100%" }} />
                  )}
                />
              </Form.Item>
            </div>
          </div>
        )}

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

        {/* ── Room details ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Typography.Text strong>Danh sách phòng đặt</Typography.Text>
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() =>
              append({
                room_id: null,
                dateRange: null,
                price_per_night: 0,
                status: "BOOKED",
              })
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
              {[
                "Phòng",
                "Check-in → Check-out",
                "Đêm",
                "Giá/đêm",
                "Tổng phòng",
                ...(isEdit ? ["Trạng thái"] : []),
                "",
              ].map((h, i) => (
                <Typography.Text
                  key={i}
                  type="secondary"
                  style={{ fontSize: 12 }}
                >
                  {h}
                </Typography.Text>
              ))}
            </div>

            {fields.map((field, index) => {
              const dr = details[index]?.dateRange;
              const nights = dr?.[0] && dr?.[1] ? dr[1].diff(dr[0], "day") : 0;
              const total = nights * (details[index]?.price_per_night || 0);

              return (
                <div
                  key={field._key}
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
                      <RoomPicker
                        {...field}
                        disabled={isEdit}
                        onChange={(val) => {
                          field.onChange(val);
                          const room = allRooms.find((r) => r.id === val);
                          if (room?.current_price_per_night != null) {
                            setValue(
                              `booking_details.${index}.price_per_night`,
                              room.current_price_per_night,
                            );
                          }
                        }}
                        placeholder="Chọn phòng"
                        style={{ width: "100%" }}
                      />
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
                        disabled={isEdit}
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
                        formatter={(v) =>
                          `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        }
                        parser={(v) => v?.replace(/\./g, "") ?? "0"}
                        disabled={isEdit}
                      />
                    )}
                  />
                  <Typography.Text
                    style={{
                      textAlign: "right",
                      whiteSpace: "nowrap",
                      fontSize: 13,
                    }}
                  >
                    {fmtVND(total)}
                  </Typography.Text>
                  {isEdit && (
                    <Controller
                      name={`booking_details.${index}.status`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={STATUS_OPTIONS}
                          size="small"
                        />
                      )}
                    />
                  )}
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
