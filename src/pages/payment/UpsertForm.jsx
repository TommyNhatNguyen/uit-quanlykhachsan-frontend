import { useQueryClient } from "@tanstack/react-query";
import { DatePicker, Form, InputNumber, message, Modal, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import EmployeePicker from "../../components/EmployeePicker";
import { usePaymentDetail, usePaymentUpsert } from "../../hooks/usePayments";

const PAYMENT_METHOD_OPTIONS = [
  { value: "cash", label: "Tiền mặt" },
  { value: "card", label: "Thẻ ngân hàng" },
  { value: "transfer", label: "Chuyển khoản" },
];

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
  const result = usePaymentDetail(id);
  const { mutate, isPending } = usePaymentUpsert();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cashier_id: null,
      total_payment: null,
      payment_method: null,
      booking_detail_id: null,
      created_at: dayjs(),
    },
  });

  useEffect(() => {
    if (result.data) {
      reset({
        cashier_id: result.data.cashier_id,
        total_payment: result.data.total_payment,
        payment_method: result.data.payment_method,
        booking_detail_id: result.data.booking_detail_id,
        created_at: result.data.created_at ? dayjs(result.data.created_at) : dayjs(),
      });
    }
  }, [result.data]);

  const onSubmit = (values) => {
    const payload = {
      ...values,
      created_at: values.created_at?.toISOString(),
    };

    mutate(
      { id, ...payload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["payments"] });
          onClose();
          message.success(isEdit ? "Cập nhật thanh toán thành công" : "Thêm thanh toán thành công");
        },
        onError: () => {
          message.error(isEdit ? "Cập nhật thất bại" : "Thêm thanh toán thất bại");
        },
      },
    );
  };

  return (
    <Modal
      open={open}
      title={isEdit ? "Chỉnh sửa thanh toán" : "Thêm thanh toán"}
      onCancel={onClose}
      onOk={handleSubmit(onSubmit)}
      okText={isEdit ? "Lưu" : "Thêm"}
      cancelText="Huỷ"
      okButtonProps={{ loading: isPending }}
      width={480}
    >
      <Form layout="vertical" style={{ paddingTop: 8 }}>
        <Form.Item
          label="Thu ngân"
          required
          validateStatus={errors.cashier_id ? "error" : ""}
          help={errors.cashier_id?.message}
        >
          <Controller
            name="cashier_id"
            control={control}
            rules={{ required: "Bắt buộc" }}
            render={({ field }) => (
              <EmployeePicker {...field} style={{ width: "100%" }} />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Chi tiết đặt phòng (ID)"
          required
          validateStatus={errors.booking_detail_id ? "error" : ""}
          help={errors.booking_detail_id?.message}
        >
          <Controller
            name="booking_detail_id"
            control={control}
            rules={{ required: "Bắt buộc" }}
            render={({ field }) => (
              <InputNumber
                {...field}
                style={{ width: "100%" }}
                controls={false}
                placeholder="ID chi tiết đặt phòng"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Phương thức thanh toán"
          required
          validateStatus={errors.payment_method ? "error" : ""}
          help={errors.payment_method?.message}
        >
          <Controller
            name="payment_method"
            control={control}
            rules={{ required: "Bắt buộc" }}
            render={({ field }) => (
              <Select {...field} options={PAYMENT_METHOD_OPTIONS} placeholder="Chọn phương thức" />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Số tiền"
          required
          validateStatus={errors.total_payment ? "error" : ""}
          help={errors.total_payment?.message}
        >
          <Controller
            name="total_payment"
            control={control}
            rules={{ required: "Bắt buộc", min: { value: 0, message: "Phải ≥ 0" } }}
            render={({ field }) => (
              <InputNumber
                {...field}
                style={{ width: "100%" }}
                controls={false}
                min={0}
                addonAfter="₫"
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                parser={(v) => v?.replace(/\./g, "") ?? "0"}
              />
            )}
          />
        </Form.Item>

        <Form.Item label="Ngày thanh toán">
          <Controller
            name="created_at"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                style={{ width: "100%" }}
                showTime
                format="DD/MM/YYYY HH:mm"
              />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
