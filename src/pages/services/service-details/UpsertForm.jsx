import { useQueryClient } from "@tanstack/react-query";
import { Form, InputNumber, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import BookingDetailPicker from "../../../components/BookingDetailPicker";
import ServicePicker from "../../../components/ServicePicker";
import { useServiceDetailItem, useServiceDetailUpsert } from "../../../hooks/useServiceDetails";
import useServiceItems from "../../../hooks/useServiceItems";

export default function UpsertForm({ id, bookingDetailId, ...props }) {
  const result = useServiceDetailItem(id);
  const queryClient = useQueryClient();
  const { data: allServicesData } = useServiceItems({ pageSize: 1000 });
  const { mutate: upsert, isPending } = useServiceDetailUpsert();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      booking_detail_id: bookingDetailId ?? null,
      service_id: null,
      quanity: 1,
      price: 0,
      total_amount: 0,
    },
  });

  const serviceId = watch("service_id");
  const quanity = watch("quanity");

  useEffect(() => {
    const service = (allServicesData?.data ?? []).find((s) => s.id === serviceId);
    if (service) {
      const price = service.current_price ?? 0;
      setValue("price", price);
      setValue("total_amount", price * (quanity || 1));
    }
  }, [serviceId, allServicesData]);

  useEffect(() => {
    const service = (allServicesData?.data ?? []).find((s) => s.id === serviceId);
    if (service) {
      setValue("total_amount", (service.current_price ?? 0) * (quanity || 1));
    }
  }, [quanity]);

  useEffect(() => {
    if (result.data) {
      reset({
        booking_detail_id: result.data.booking_detail_id,
        service_id: result.data.service_id,
        quanity: result.data.quanity ?? 1,
        price: result.data.price ?? 0,
        total_amount: result.data.total_amount ?? 0,
      });
    }
  }, [result.data]);

  useEffect(() => () => reset(), []);

  const onFormSubmit = (values) => {
    upsert(
      { id, ...values },
      {
        onSuccess: () => {
          message.success(id ? "Đã cập nhật" : "Đã thêm sử dụng dịch vụ");
          queryClient.invalidateQueries({ queryKey: ["service-details"] });
          queryClient.invalidateQueries({ queryKey: ["booking-details"] });
          queryClient.invalidateQueries({ queryKey: ["bookings"] });
          props.onClose();
        },
        onError: () => {
          message.error(id ? "Lỗi khi cập nhật" : "Lỗi khi thêm");
        },
      },
    );
  };

  return (
    <Modal
      open={props.open}
      onCancel={props.onClose}
      loading={isPending}
      title={id ? "Chỉnh sửa sử dụng dịch vụ" : "Thêm sử dụng dịch vụ"}
      onOk={handleSubmit(onFormSubmit)}
      okText="Lưu"
      cancelText="Huỷ"
      width={480}
    >
      <Form layout="vertical" style={{ paddingTop: 8 }}>
        <Form.Item
          label="Chi tiết đặt phòng"
          required
          validateStatus={errors.booking_detail_id ? "error" : ""}
          help={errors.booking_detail_id?.message}
        >
          <Controller
            name="booking_detail_id"
            control={control}
            rules={{ required: "Bắt buộc" }}
            render={({ field }) => (
              <BookingDetailPicker {...field} style={{ width: "100%" }} />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Dịch vụ"
          required
          validateStatus={errors.service_id ? "error" : ""}
          help={errors.service_id?.message}
        >
          <Controller
            name="service_id"
            control={control}
            rules={{ required: "Bắt buộc" }}
            render={({ field }) => (
              <ServicePicker {...field} style={{ width: "100%" }} />
            )}
          />
        </Form.Item>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 16px" }}>
          <Form.Item label="Số lượng" required>
            <Controller
              name="quanity"
              control={control}
              rules={{ required: "Bắt buộc", min: { value: 1, message: "≥ 1" } }}
              render={({ field }) => (
                <InputNumber {...field} min={1} style={{ width: "100%" }} controls />
              )}
            />
          </Form.Item>

          <Form.Item label="Đơn giá">
            <Controller
              name="price"
              control={control}
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

          <Form.Item label="Thành tiền">
            <Controller
              name="total_amount"
              control={control}
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
        </div>
      </Form>
    </Modal>
  );
}

export const UpsertFormTrigger = ({ children, id, bookingDetailId }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {React.cloneElement(children, { onClick: () => setOpen(true) })}
      {open && (
        <UpsertForm
          id={id}
          bookingDetailId={bookingDetailId}
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};
