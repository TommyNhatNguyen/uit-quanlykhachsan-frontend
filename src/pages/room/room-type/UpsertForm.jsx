import { useQueryClient } from "@tanstack/react-query";
import { Form, Input, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRoomTypeDetail, useRoomTypeUpsert } from "../../../hooks/useRoomTypes";

export default function UpsertForm({ id, ...props }) {
  const result = useRoomTypeDetail(id);
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate: upsert, isPending } = useRoomTypeUpsert();

  const onFormSubmit = (values) => {
    upsert(
      { id, name: values.name },
      {
        onSuccess: () => {
          message.success(id ? "Đã cập nhật loại phòng" : "Đã thêm loại phòng");
          queryClient.invalidateQueries({ queryKey: ["room-types"] });
          props.onClose();
        },
        onError: () => {
          message.error(id ? "Lỗi khi cập nhật loại phòng" : "Lỗi khi thêm loại phòng");
        },
      },
    );
  };

  useEffect(() => {
    if (result.data) {
      reset({ name: result.data.name || "" });
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
      title={id ? "Chỉnh sửa loại phòng" : "Thêm loại phòng"}
      onOk={handleSubmit(onFormSubmit)}
      okText="Lưu"
      cancelText="Huỷ"
    >
      <Form layout="vertical">
        <Form.Item
          label="Tên loại phòng"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
          required
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Vui lòng nhập tên loại phòng" }}
            render={({ field }) => (
              <Input {...field} placeholder="VD: Phòng đơn, Phòng đôi..." />
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
      {open && <UpsertForm id={id} open={open} onClose={() => setOpen(false)} />}
    </>
  );
};
