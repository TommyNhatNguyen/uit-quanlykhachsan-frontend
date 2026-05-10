import { useQueryClient } from "@tanstack/react-query";
import { Form, Input, InputNumber, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  useServiceItemDetail,
  useServiceItemUpsert,
} from "../../../hooks/useServiceItems";

export default function UpdatePriceForm({ id, ...props }) {
  const { data: service } = useServiceItemDetail(id);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate: upsert, isPending } = useServiceItemUpsert();

  const onFormSubmit = (values) => {
    upsert(
      {
        id,
        name: service?.name,
        catalog: service?.catalog ?? null,
        current_price: values.current_price,
      },
      {
        onSuccess: () => {
          message.success("Đã cập nhật giá thành công");
          queryClient.invalidateQueries({ queryKey: ["service-items"] });
          queryClient.invalidateQueries({ queryKey: ["service-price-logs"] });
          props.onClose();
        },
        onError: () => {
          message.error("Lỗi khi cập nhật giá");
        },
      }
    );
  };

  useEffect(() => {
    if (service) {
      reset({ current_price: service.current_price });
    }
  }, [service]);

  useEffect(() => {
    return () => reset();
  }, []);

  return (
    <Modal
      open={props.open}
      onCancel={props.onClose}
      confirmLoading={isPending}
      title="Cập nhật giá dịch vụ"
      onOk={handleSubmit(onFormSubmit)}
      okText="Lưu"
      cancelText="Huỷ"
      width={480}
    >
      <Form layout="vertical">
        <div className="grid grid-cols-2 gap-x-4">
          <Form.Item label="Tên dịch vụ">
            <Input value={service?.name} disabled />
          </Form.Item>
          <Form.Item label="Danh mục">
            <Input value={service?.catalog || "—"} disabled />
          </Form.Item>
        </div>
        <Form.Item
          validateStatus={errors["current_price"] ? "error" : ""}
          help={errors["current_price"]?.message}
          required
          label="Giá dịch vụ"
        >
          <Controller
            name="current_price"
            control={control}
            rules={{ required: "Vui lòng nhập giá" }}
            render={({ field: f }) => (
              <InputNumber
                {...f}
                style={{ width: "100%" }}
                placeholder="VD: 50.000"
                min={0}
                addonAfter="VNĐ"
                formatter={(v) =>
                  `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
              />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export const UpdatePriceFormTrigger = ({ children, id }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {React.cloneElement(children, { onClick: () => setOpen(true) })}
      {open && (
        <UpdatePriceForm id={id} open={open} onClose={() => setOpen(false)} />
      )}
    </>
  );
};
