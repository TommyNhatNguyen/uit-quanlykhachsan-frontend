import { useQueryClient } from "@tanstack/react-query";
import { Form, Input, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  useMembershipTypeDetail,
  useMembershipTypeUpsert,
} from "../../hooks/useMembershipTypes";

export default function UpsertForm({ id, ...props }) {
  const result = useMembershipTypeDetail(id);
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate: upsert, isPending } = useMembershipTypeUpsert();

  const onFormSubmit = (values) => {
    upsert(
      { id, name: values.name },
      {
        onSuccess: () => {
          message.success(id ? "Đã cập nhật hạng thành viên" : "Đã thêm hạng thành viên");
          queryClient.invalidateQueries({ queryKey: ["membership-types"] });
          props.onClose();
        },
        onError: () => {
          message.error(id ? "Lỗi khi cập nhật hạng thành viên" : "Lỗi khi thêm hạng thành viên");
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
      title={id ? "Chỉnh sửa hạng thành viên" : "Thêm hạng thành viên"}
      onOk={handleSubmit(onFormSubmit)}
      okText="Lưu"
      cancelText="Huỷ"
    >
      <Form layout="vertical">
        <Form.Item
          label="Tên hạng thành viên"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
          required
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Vui lòng nhập tên hạng thành viên" }}
            render={({ field }) => (
              <Input {...field} placeholder="VD: Gold, Diamond..." />
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
