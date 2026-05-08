import { useQueryClient } from "@tanstack/react-query";
import { Form, Input, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useHotelDetail, useHotelUpsert } from "../../hooks/useHotels";

export default function UpsertForm({ id, ...props }) {
  const result = useHotelDetail(id);
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate: upsert, isPending } = useHotelUpsert();

  const onFormSubmit = (values) => {
    upsert(
      {
        id,
        name: values.name,
        phone: values.phone,
        address: values.address,
      },
      {
        onSuccess: () => {
          message.success(id ? "Đã cập nhật chi nhánh" : "Đã thêm chi nhánh");
          queryClient.invalidateQueries({ queryKey: ["hotels"] });
          props.onClose();
        },
        onError: () => {
          message.error(
            id ? "Lỗi khi cập nhật chi nhánh" : "Lỗi khi thêm chi nhánh",
          );
        },
      },
    );
  };

  useEffect(() => {
    if (result.data) {
      reset({
        id: result.data.id || "",
        name: result.data.name || "",
        phone: result.data.phone || "",
        address: result.data.address || "",
      });
    }
  }, [result.data]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  return (
    <Modal
      open={props.open}
      onCancel={props.onClose}
      loading={isPending}
      title={id ? "Chỉnh sửa chi nhánh" : "Thêm chi nhánh"}
      onOk={handleSubmit(onFormSubmit)}
      okText="Lưu"
      cancelText="Huỷ"
    >
      <Form layout="vertical">
        <Form.Item
          label="Tên chi nhánh"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
          required
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Vui lòng nhập tên chi nhánh" }}
            render={({ field }) => (
              <Input {...field} placeholder="VD: Chi nhánh 1" />
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
              <Input {...field} placeholder="VD: 0909090909" />
            )}
          />
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          required
          validateStatus={errors.address ? "error" : ""}
          help={errors.address?.message}
        >
          <Controller
            name="address"
            control={control}
            rules={{ required: "Vui lòng nhập địa chỉ" }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="VD: 123 Đường ABC, Quận XYZ, TP. HCM"
              />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export const UpsertFormTrigger = ({ children, id }) => {
  const [open, setOpen] = useState(false);
  const _onClick = () => { setOpen(true); };
  const _onClose = () => { setOpen(false); };
  return (
    <>
      {React.cloneElement(children, { onClick: _onClick })}
      {open && <UpsertForm id={id} open={open} onClose={_onClose} />}
    </>
  );
};
