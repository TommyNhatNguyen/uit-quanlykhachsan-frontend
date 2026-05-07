import { useQueryClient } from "@tanstack/react-query";
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import MembershipPicker from "../../components/MembershipPicker";
import { useCustomerDetail, useCustomerUpsert } from "../../hooks/useCustomers";

const SEX_OPTIONS = [
  { label: "Nam", value: 1 },
  { label: "Nữ", value: 2 },
  { label: "Khác", value: 3 },
];

export default function UpsertForm({ id, ...props }) {
  const result = useCustomerDetail(id);
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate: upsert, isPending } = useCustomerUpsert();

  const onFormSubmit = (values) => {
    upsert(
      {
        id,
        name: values.name,
        phone: values.phone,
        sex: values.sex,
        identification_id: values.identification_id,
        email: values.email || null,
        birthday: values.birthday ? values.birthday.toISOString() : null,
        membership_type_id: values.membership_type_id || null,
      },
      {
        onSuccess: () => {
          message.success(id ? "Đã cập nhật khách hàng" : "Đã thêm khách hàng");
          queryClient.invalidateQueries({ queryKey: ["customers"] });
          props.onClose();
        },
        onError: () => {
          message.error(
            id ? "Lỗi khi cập nhật khách hàng" : "Lỗi khi thêm khách hàng",
          );
        },
      },
    );
  };

  useEffect(() => {
    if (result.data) {
      reset({
        name: result.data.name || "",
        phone: result.data.phone || null,
        sex: result.data.sex || null,
        identification_id: result.data.identification_id || "",
        email: result.data.email || "",
        birthday: result.data.birthday ? dayjs(result.data.birthday) : null,
        membership_type_id: result.data.membership_type_id || null,
      });
    }
  }, [result.data]);

  useEffect(() => {
    return () => reset();
  }, []);

  return (
    <Modal
      open={props.open}
      onCancel={props.onClose}
      loading={isPending}
      title={id ? "Chỉnh sửa khách hàng" : "Thêm khách hàng"}
      onOk={handleSubmit(onFormSubmit)}
      okText="Lưu"
      cancelText="Huỷ"
    >
      <Form layout="vertical">
        <Form.Item
          label="Họ tên"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
          required
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Vui lòng nhập họ tên" }}
            render={({ field }) => (
              <Input {...field} placeholder="VD: Nguyễn Văn A" />
            )}
          />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          validateStatus={errors.phone ? "error" : ""}
          help={errors.phone?.message}
          required
        >
          <Controller
            name="phone"
            control={control}
            rules={{ required: "Vui lòng nhập số điện thoại" }}
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
          validateStatus={errors.sex ? "error" : ""}
          help={errors.sex?.message}
          required
        >
          <Controller
            name="sex"
            control={control}
            rules={{ required: "Vui lòng chọn giới tính" }}
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
          validateStatus={errors.identification_id ? "error" : ""}
          help={errors.identification_id?.message}
          required
        >
          <Controller
            name="identification_id"
            control={control}
            rules={{ required: "Vui lòng nhập CCCD / Hộ chiếu" }}
            render={({ field }) => (
              <Input {...field} placeholder="VD: 012345678901" />
            )}
          />
        </Form.Item>
        <Form.Item label="Email">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="VD: example@email.com" />
            )}
          />
        </Form.Item>
        <Form.Item label="Ngày sinh">
          <Controller
            name="birthday"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                className="w-full"
                format="DD/MM/YYYY"
                placeholder="Chọn ngày sinh"
              />
            )}
          />
        </Form.Item>
        <Form.Item label="Hạng thành viên">
          <Controller
            name="membership_type_id"
            control={control}
            render={({ field }) => (
              <MembershipPicker {...field} className="w-full" />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export const UpsertFormTrigger = ({ children, id }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {React.cloneElement(children, { onClick: () => setOpen(true) })}
      {open && (
        <UpsertForm id={id} open={open} onClose={() => setOpen(false)} />
      )}
    </>
  );
};
