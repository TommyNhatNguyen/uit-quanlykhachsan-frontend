import { useQueryClient } from "@tanstack/react-query";
import { Form, Input, InputNumber, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRoomDetail, useRoomUpdatePrice } from "../../../hooks/useRooms";

export default function UpdatePriceForm({ id, ...props }) {
  const result = useRoomDetail(id);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate: updatePrice, isPending } = useRoomUpdatePrice();

  const onFormSubmit = (values) => {
    updatePrice(values, {
      onSuccess: () => {
        message.success("Đã cập nhật giá thành công");
        queryClient.invalidateQueries({ queryKey: ["rooms"] });
        props.onClose();
      },
      onError: () => {
        message.error("Lỗi khi cập nhật giá");
      },
    });
  };

  useEffect(() => {
    if (result.data) {
      reset({
        room_id: result?.data?.id,
        price_per_night: result?.data?.current_price_per_night,
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
      title={id ? "Chỉnh sửa phòng" : "Thêm phòng"}
      onOk={handleSubmit(onFormSubmit)}
      okText="Lưu"
      cancelText="Huỷ"
      width={640}
    >
      <Form layout="vertical">
        <div className="grid grid-cols-2 gap-x-4">
          <Form.Item label={"Số phòng"}>
            <Input value={result?.data?.room_num} disabled />
          </Form.Item>
          <Form.Item label={"Tên phòng"}>
            <Input value={result?.data?.room_name} disabled />
          </Form.Item>
        </div>
        <div className="grid grid-cols-1 ">
          <Form.Item
            validateStatus={errors["price_per_night"] ? "error" : ""}
            help={errors["price_per_night"]?.message}
            required
            label={"Giá phòng"}
          >
            <Controller
              name="price_per_night"
              control={control}
              rules={{ required: "Vui lòng nhập số dương" }}
              render={({ field: f }) => (
                <InputNumber
                  {...f}
                  className="w-full"
                  placeholder="VD: 300.000"
                  style={{
                    width: "100%",
                  }}
                  min={0}
                  addonAfter="VNĐ"
                  formatter={(v) =>
                    `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              )}
            />
          </Form.Item>
        </div>
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
