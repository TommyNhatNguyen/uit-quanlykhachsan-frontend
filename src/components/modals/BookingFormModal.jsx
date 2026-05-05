import { DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { TODAY } from "../../constants";
import { fmtVND } from "../../utils";

export default function BookingFormModal({
  open,
  id,
  data,
  onClose,
  onSubmit,
  prefillCustomerId,
}) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const booking = id ? data.bookings.find((b) => b.id === id) : null;
  const tomorrow = dayjs(TODAY).add(1, "day");

  useEffect(() => {
    if (open) {
      reset({
        customerId: prefillCustomerId || booking?.customerId || undefined,
        checkin: dayjs(booking?.checkin || TODAY),
        checkout: dayjs(booking?.checkout || tomorrow.format("YYYY-MM-DD")),
        room: booking ? booking.rooms.split(",")[0].trim() : undefined,
        quantity: booking ? booking.rooms.split(",").length : 1,
        notes: booking?.notes || "",
      });
    } else {
      reset();
    }
  }, [open, id, prefillCustomerId]);

  const onFormSubmit = (values) =>
    onSubmit({
      id: booking?.id || "",
      customerId: values.customerId,
      checkin: values.checkin.format("YYYY-MM-DD"),
      checkout: values.checkout.format("YYYY-MM-DD"),
      room: values.room,
      quantity: values.quantity,
      notes: values.notes || "",
    });

  const availableRooms = data.rooms.filter((r) => r.status !== "maintenance");

  return (
    <Modal
      open={open}
      title={booking ? `Sửa booking #${booking.id}` : "Tạo booking mới"}
      onCancel={onClose}
      onOk={handleSubmit(onFormSubmit)}
      okText="Lưu"
      cancelText="Huỷ"
      width={760}
      destroyOnHidden
    >
      <Form layout="vertical">
        <Form.Item
          label="Khách hàng"
          validateStatus={errors.customerId ? "error" : ""}
          help={errors.customerId?.message}
        >
          <Controller
            name="customerId"
            control={control}
            rules={{ required: "Vui lòng chọn khách hàng" }}
            render={({ field }) => (
              <Select
                {...field}
                showSearch
                placeholder="-- Chọn khách hàng --"
                optionFilterProp="label"
                options={data.customers.map((c) => ({
                  value: c.id,
                  label: `${c.name} · ${c.phone}`,
                }))}
              />
            )}
          />
        </Form.Item>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <Form.Item
            label="Check-in"
            validateStatus={errors.checkin ? "error" : ""}
            help={errors.checkin?.message}
          >
            <Controller
              name="checkin"
              control={control}
              rules={{ required: "Vui lòng chọn ngày" }}
              render={({ field }) => (
                <DatePicker {...field} style={{ width: "100%" }} format="DD/MM/YYYY" />
              )}
            />
          </Form.Item>
          <Form.Item
            label="Check-out"
            validateStatus={errors.checkout ? "error" : ""}
            help={errors.checkout?.message}
          >
            <Controller
              name="checkout"
              control={control}
              rules={{ required: "Vui lòng chọn ngày" }}
              render={({ field }) => (
                <DatePicker {...field} style={{ width: "100%" }} format="DD/MM/YYYY" />
              )}
            />
          </Form.Item>
          <Form.Item
            label="Phòng"
            validateStatus={errors.room ? "error" : ""}
            help={errors.room?.message}
          >
            <Controller
              name="room"
              control={control}
              rules={{ required: "Vui lòng chọn phòng" }}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="-- Chọn phòng --"
                  optionFilterProp="label"
                  options={availableRooms.map((r) => ({
                    value: r.number,
                    label: `Phòng ${r.number} · ${r.type} · ${fmtVND(r.price)}/đêm`,
                  }))}
                />
              )}
            />
          </Form.Item>
          <Form.Item label="Số lượng phòng">
            <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <InputNumber {...field} min={1} style={{ width: "100%" }} />
              )}
            />
          </Form.Item>
        </div>
        <Form.Item label="Ghi chú">
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <Input.TextArea {...field} rows={2} placeholder="Yêu cầu đặc biệt..." />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
