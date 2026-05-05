import { DatePicker, Form, InputNumber, Modal, Select } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { TODAY } from "../../constants";

export default function PriceFormModal({ open, data, onClose, onSubmit }) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (open) {
      reset({
        roomNumber: data.rooms[0]?.number,
        from: dayjs(TODAY),
        to: null,
      });
    } else {
      reset();
    }
  }, [open]);

  const onFormSubmit = (values) =>
    onSubmit({
      roomNumber: values.roomNumber,
      from: values.from.format("YYYY-MM-DD"),
      to: values.to ? values.to.format("YYYY-MM-DD") : "",
      price: values.price,
    });

  return (
    <Modal
      open={open}
      title="Áp giá mới"
      onCancel={onClose}
      onOk={handleSubmit(onFormSubmit)}
      okText="Lưu"
      cancelText="Huỷ"
      width={440}
      destroyOnHidden
    >
      <Form layout="vertical">
        <Form.Item label="Phòng" validateStatus={errors.roomNumber ? "error" : ""} help={errors.roomNumber?.message}>
          <Controller
            name="roomNumber"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                options={data.rooms.map((r) => ({
                  value: r.number,
                  label: `${r.number} · ${r.type}`,
                }))}
              />
            )}
          />
        </Form.Item>
        <Form.Item label="Áp dụng từ" validateStatus={errors.from ? "error" : ""} help={errors.from?.message}>
          <Controller
            name="from"
            control={control}
            rules={{ required: "Vui lòng chọn ngày bắt đầu" }}
            render={({ field }) => (
              <DatePicker {...field} style={{ width: "100%" }} format="DD/MM/YYYY" />
            )}
          />
        </Form.Item>
        <Form.Item label="Áp dụng đến (để trống = không giới hạn)">
          <Controller
            name="to"
            control={control}
            render={({ field }) => (
              <DatePicker {...field} style={{ width: "100%" }} format="DD/MM/YYYY" />
            )}
          />
        </Form.Item>
        <Form.Item label="Giá/đêm (₫)" validateStatus={errors.price ? "error" : ""} help={errors.price?.message}>
          <Controller
            name="price"
            control={control}
            rules={{ required: "Vui lòng nhập giá" }}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                step={10000}
                style={{ width: "100%" }}
                formatter={(v) => v ? new Intl.NumberFormat("vi-VN").format(v) : ""}
                parser={(v) => v.replace(/\D/g, "")}
              />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
