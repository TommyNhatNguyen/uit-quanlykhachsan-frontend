import { useQueryClient } from "@tanstack/react-query";
import { Checkbox, Form, Input, InputNumber, message, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import RoomTypePicker from "../../../components/RoomTypePicker";
import useHotels from "../../../hooks/useHotels";
import { useRoomDetail, useRoomUpsert } from "../../../hooks/useRooms";

export default function UpsertForm({ id, ...props }) {
  const result = useRoomDetail(id);
  const queryClient = useQueryClient();
  const { data: hotelsData } = useHotels({ pageSize: 100 });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate: upsert, isPending } = useRoomUpsert();

  const onFormSubmit = (values) => {
    upsert(
      { id, ...values },
      {
        onSuccess: () => {
          message.success(id ? "Đã cập nhật phòng" : "Đã thêm phòng");
          queryClient.invalidateQueries({ queryKey: ["rooms"] });
          props.onClose();
        },
        onError: () => {
          message.error(id ? "Lỗi khi cập nhật phòng" : "Lỗi khi thêm phòng");
        },
      },
    );
  };

  useEffect(() => {
    if (result.data) {
      reset({
        room_num: result.data.room_num || "",
        room_name: result.data.room_name || "",
        capacity: result.data.capacity,
        area: result.data.area,
        current_price_per_night: result.data.current_price_per_night,
        room_type_id: result.data.room_type_id ?? null,
        hotel_id: result.data.hotel_id ?? null,
        description: result.data.description || "",
        is_smoking: result.data.is_smoking ?? false,
        has_wifi: result.data.has_wifi ?? false,
        has_pool: result.data.has_pool ?? false,
        is_underconstruction: result.data.is_underconstruction ?? false,
      });
    }
  }, [result.data]);

  useEffect(() => {
    return () => reset();
  }, []);

  const hotelOptions = (hotelsData?.data ?? []).map((h) => ({
    label: h.name,
    value: h.id,
  }));

  const field = (name, label, required, children) => (
    <Form.Item
      label={label}
      validateStatus={errors[name] ? "error" : ""}
      help={errors[name]?.message}
      required={required}
    >
      {children}
    </Form.Item>
  );

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
          {field("room_num", "Số phòng", true,
            <Controller
              name="room_num"
              control={control}
              rules={{ required: "Vui lòng nhập số phòng" }}
              render={({ field: f }) => <Input {...f} placeholder="VD: 101" />}
            />
          )}
          {field("room_name", "Tên phòng", true,
            <Controller
              name="room_name"
              control={control}
              rules={{ required: "Vui lòng nhập tên phòng" }}
              render={({ field: f }) => <Input {...f} placeholder="VD: Phòng Hoa Hồng" />}
            />
          )}
          {field("capacity", "Sức chứa", true,
            <Controller
              name="capacity"
              control={control}
              rules={{ required: "Vui lòng nhập sức chứa" }}
              render={({ field: f }) => (
                <InputNumber {...f} min={1} className="w-full" addonAfter="người" />
              )}
            />
          )}
          {field("area", "Diện tích", true,
            <Controller
              name="area"
              control={control}
              rules={{ required: "Vui lòng nhập diện tích" }}
              render={({ field: f }) => (
                <InputNumber {...f} min={0} className="w-full" addonAfter="m²" />
              )}
            />
          )}
          {field("current_price_per_night", "Giá/đêm", true,
            <Controller
              name="current_price_per_night"
              control={control}
              rules={{ required: "Vui lòng nhập giá" }}
              render={({ field: f }) => (
                <InputNumber {...f} min={0} className="w-full" addonAfter="VNĐ" formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
              )}
            />
          )}
          {field("room_type_id", "Loại phòng", false,
            <Controller
              name="room_type_id"
              control={control}
              render={({ field: f }) => (
                <RoomTypePicker {...f} className="w-full" />
              )}
            />
          )}
          {field("hotel_id", "Chi nhánh", false,
            <Controller
              name="hotel_id"
              control={control}
              render={({ field: f }) => (
                <Select {...f} options={hotelOptions} placeholder="Chọn chi nhánh" allowClear className="w-full" />
              )}
            />
          )}
        </div>
        {field("description", "Mô tả", false,
          <Controller
            name="description"
            control={control}
            render={({ field: f }) => <Input.TextArea {...f} rows={2} placeholder="Mô tả phòng..." />}
          />
        )}
        <div className="flex gap-6 flex-wrap">
          <Controller name="is_smoking" control={control} render={({ field: f }) => (
            <Checkbox checked={f.value} onChange={(e) => f.onChange(e.target.checked)}>Cho phép hút thuốc</Checkbox>
          )} />
          <Controller name="has_wifi" control={control} render={({ field: f }) => (
            <Checkbox checked={f.value} onChange={(e) => f.onChange(e.target.checked)}>Wifi</Checkbox>
          )} />
          <Controller name="has_pool" control={control} render={({ field: f }) => (
            <Checkbox checked={f.value} onChange={(e) => f.onChange(e.target.checked)}>Hồ bơi</Checkbox>
          )} />
          <Controller name="is_underconstruction" control={control} render={({ field: f }) => (
            <Checkbox checked={f.value} onChange={(e) => f.onChange(e.target.checked)}>Đang thi công</Checkbox>
          )} />
        </div>
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
