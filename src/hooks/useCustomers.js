import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message, Modal } from "antd";
import { useState } from "react";
import { customersApi } from "../api/customers";

export function useCustomers(data, persist) {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);

  const openForm = (id = null) => {
    setEditingId(id);
    setFormOpen(true);
  };
  const openDetail = (id) => {
    setViewingId(id);
    setDetailOpen(true);
  };
  const closeAll = () => {
    setFormOpen(false);
    setDetailOpen(false);
    setEditingId(null);
    setViewingId(null);
  };

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["state"] });

  const createMutation = useMutation({
    mutationFn: (payload) => customersApi.create(payload),
    onSuccess: () => {
      invalidate();
      message.success("Đã thêm khách hàng");
      closeAll();
    },
    onError: (err) => message.error(err.message || "Lỗi khi thêm khách hàng"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => customersApi.update(id, payload),
    onSuccess: () => {
      invalidate();
      message.success("Đã cập nhật khách hàng");
      closeAll();
    },
    onError: (err) =>
      message.error(err.message || "Lỗi khi cập nhật khách hàng"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => customersApi.delete(id),
    onSuccess: () => {
      invalidate();
      message.success("Đã xoá khách hàng");
    },
    onError: (err) => message.error(err.message || "Lỗi khi xoá khách hàng"),
  });

  const submitCustomer = (formData) => {
    const payload = {
      customer_name: formData.name,
      sex: formData.sex,
      phone: formData.phone,
      email: formData.email || "",
      birthday: formData.dob || null,
      notes: formData.notes || "",
    };
    if (formData.id) {
      updateMutation.mutate({ id: +formData.id, payload });
    } else {
      createMutation.mutate({
        ...payload,
        membership_type_id: 1,
        total_paid: 0,
      });
    }
  };

  const deleteCustomer = (id) => {
    const c = data.customers.find((x) => x.id === id);
    if (!c) return;
    if (data.bookings.some((b) => b.customerId === c.id)) {
      message.error(
        "Không thể xoá: khách có booking. Hãy xoá các booking trước.",
      );
      return;
    }
    Modal.confirm({
      title: "Xoá khách hàng",
      content: `Xoá khách hàng ${c.name}?`,
      okText: "Xoá",
      okButtonProps: { danger: true },
      cancelText: "Huỷ",
      onOk: () => deleteMutation.mutate(id),
    });
  };

  return {
    formOpen,
    detailOpen,
    editingId,
    viewingId,
    openForm,
    openDetail,
    closeAll,
    submitCustomer,
    deleteCustomer,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
}
