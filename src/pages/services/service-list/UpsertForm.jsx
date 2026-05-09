import { useQueryClient } from "@tanstack/react-query";
import { Form, Input, InputNumber, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useServiceItemDetail, useServiceItemUpsert } from "../../../hooks/useServiceItems";

export default function UpsertForm({ id, ...props }) {
  const result = useServiceItemDetail(id);
  const queryClient = useQueryClient();
  const { mutate: upsert, isPending } = useServiceItemUpsert();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", catalog: "", current_price: 0 },
  });

  useEffect(() => {
    if (result.data) {
      reset({
        name: result.data.name || "",
        catalog: result.data.catalog || "",
        current_price: result.data.current_price ?? 0,
      });
    }
  }, [result.data]);

  useEffect(() => () => reset(), []);

  const onFormSubmit = (values) => {
    upsert(
      { id, ...values },
      {
        onSuccess: () => {
          message.success(id ? "Đã cập nhật dịch vụ" : "Đã thêm dịch vụ");
          queryClient.invalidateQueries({ queryKey: ["service-items"] });
          props.onClose();
        },
        onError: () => {
          message.error(id ? "Lỗi khi cập nhật dịch vụ" : "Lỗi khi thêm dịch vụ");
        },
      },
    );
  };

  return (
    <Modal
      open={props.open}
      onCancel={props.onClose}
      loading={isPending}
      title={id ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ"}
      onOk={handleSubmit(onFormSubmit)}
      okText="Lưu"
      cancelText="Huỷ"
      width={480}
    >
      <Form layout="vertical" style={{ paddingTop: 8 }}>
        <Form.Item
          label="Tên dịch vụ"
          required
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Vui lòng nhập tên dịch vụ" }}
            render={({ field }) => (
              <Input {...field} placeholder="VD: Dọn phòng, Giặt ủi..." />
            )}
          />
        </Form.Item>

        <Form.Item label="Danh mục">
          <Controller
            name="catalog"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="VD: Vệ sinh, Ăn uống..." />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Giá hiện tại"
          required
          validateStatus={errors.current_price ? "error" : ""}
          help={errors.current_price?.message}
        >
          <Controller
            name="current_price"
            control={control}
            rules={{ required: "Vui lòng nhập giá" }}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                style={{ width: "100%" }}
                addonAfter="₫"
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                parser={(v) => v?.replace(/\./g, "") ?? "0"}
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
  return (
    <>
      {React.cloneElement(children, { onClick: () => setOpen(true) })}
      {open && <UpsertForm id={id} open={open} onClose={() => setOpen(false)} />}
    </>
  );
};
