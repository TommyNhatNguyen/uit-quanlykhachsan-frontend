import { useQueryClient } from "@tanstack/react-query";
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Switch,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useEmployeeDetail, useEmployeeUpsert } from "../../hooks/useEmployees";

const ROLE_OPTIONS = [
  { value: "staff", label: "Nhân viên" },
  { value: "admin", label: "Quản lý" },
  { value: "accountant", label: "Kế toán" },
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
  const result = useEmployeeDetail(id);
  const { mutate, isPending } = useEmployeeUpsert();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      name: "",
      phone: null,
      start_working_date: null,
      birthday: null,
      position: "",
      role: "staff",
      is_working: true,
    },
  });

  useEffect(() => {
    if (result.data) {
      reset({
        name: result.data.name ?? "",
        phone: result.data.phone ?? null,
        start_working_date: result.data.start_working_date
          ? dayjs(result.data.start_working_date)
          : null,
        birthday: result.data.birthday ? dayjs(result.data.birthday) : null,
        position: result.data.position ?? "",
        role: result.data.role ?? "staff",
        is_working: result.data.is_working ?? true,
      });
    }
  }, [result.data]);

  const onSubmit = (values) => {
    const payload = { ...values };
    if (payload.start_working_date)
      payload.start_working_date = payload.start_working_date.toISOString();
    if (payload.birthday) payload.birthday = payload.birthday.toISOString();
    else delete payload.birthday;
    if (!payload.position) delete payload.position;
    if (isEdit) {
      delete payload.username;
      delete payload.password;
    }

    mutate(
      { id, ...payload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["employees"] });
          onClose();
          message.success(
            id ? "Cập nhật nhân viên thành công" : "Thêm nhân viên thành công",
          );
        },
        onError: () => {
          message.error(
            id ? "Cập nhật nhân viên thất bại" : "Thêm nhân viên thất bại",
          );
        },
      },
    );
  };

  return (
    <Modal
      open={open}
      title={isEdit ? "Chỉnh sửa nhân viên" : "Thêm nhân viên"}
      onCancel={onClose}
      onOk={handleSubmit(onSubmit)}
      okText={isEdit ? "Lưu" : "Thêm"}
      cancelText="Huỷ"
      okButtonProps={{ loading: isPending }}
      width={520}
    >
      <Form layout="vertical" style={{ paddingTop: 8 }}>
        {!isEdit && (
          <>
            <Form.Item
              label="Tên đăng nhập"
              required
              validateStatus={errors.username ? "error" : ""}
              help={errors.username?.message}
            >
              <Controller
                name="username"
                control={control}
                rules={{ required: "Bắt buộc" }}
                render={({ field }) => (
                  <Input {...field} placeholder="username" />
                )}
              />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              required
              validateStatus={errors.password ? "error" : ""}
              help={errors.password?.message}
            >
              <Controller
                name="password"
                control={control}
                rules={{ required: "Bắt buộc" }}
                render={({ field }) => (
                  <Input.Password {...field} placeholder="••••••••" />
                )}
              />
            </Form.Item>
          </>
        )}
        <Form.Item
          label="Họ tên"
          required
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Bắt buộc" }}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="SĐT"
          required
          validateStatus={errors.phone ? "error" : ""}
          help={errors.phone?.message}
        >
          <Controller
            name="phone"
            control={control}
            rules={{ required: "Bắt buộc" }}
            render={({ field }) => (
              <InputNumber
                {...field}
                style={{ width: "100%" }}
                controls={false}
              />
            )}
          />
        </Form.Item>
        <Form.Item
          label="Ngày bắt đầu làm việc"
          required
          validateStatus={errors.start_working_date ? "error" : ""}
          help={errors.start_working_date?.message}
        >
          <Controller
            name="start_working_date"
            control={control}
            rules={{ required: "Bắt buộc" }}
            render={({ field }) => (
              <DatePicker
                {...field}
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
              />
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
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
              />
            )}
          />
        </Form.Item>
        <Form.Item label="Vị trí">
          <Controller
            name="position"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Lễ tân, Buồng phòng…" />
            )}
          />
        </Form.Item>
        <Form.Item
          label="Vai trò"
          required
          validateStatus={errors.role ? "error" : ""}
          help={errors.role?.message}
        >
          <Controller
            name="role"
            control={control}
            rules={{ required: "Bắt buộc" }}
            render={({ field }) => <Select {...field} options={ROLE_OPTIONS} />}
          />
        </Form.Item>
        {isEdit && (
          <Form.Item label="Đang làm việc">
            <Controller
              name="is_working"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onChange={field.onChange} />
              )}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
