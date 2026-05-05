import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message, Modal } from 'antd';
import { useState } from 'react';
import { employeesApi } from '../api/employees';

export function useEmployees(data, persist) {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const openForm = (id = null) => { setEditingId(id); setFormOpen(true); };
  const closeAll = () => { setFormOpen(false); setEditingId(null); };

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['state'] });

  const createMutation = useMutation({
    mutationFn: (payload) => employeesApi.create(payload),
    onSuccess: () => {
      invalidate();
      message.success('Đã thêm nhân viên');
      closeAll();
    },
    onError: (err) => message.error(err.message || 'Lỗi khi thêm nhân viên'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => employeesApi.update(id, payload),
    onSuccess: () => {
      invalidate();
      message.success('Đã cập nhật nhân viên');
      closeAll();
    },
    onError: (err) => message.error(err.message || 'Lỗi khi cập nhật nhân viên'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => employeesApi.delete(id),
    onSuccess: () => {
      invalidate();
      message.success('Đã xoá nhân viên');
    },
    onError: (err) => message.error(err.message || 'Lỗi khi xoá nhân viên'),
  });

  const submitEmployee = (formData) => {
    const payload = {
      employee_name: formData.name,
      birthday: formData.dob || null,
      phone: formData.phone,
      is_working: formData.working === 'true' ? 'Y' : 'N',
      position: formData.position,
      start_working_date: formData.start || null,
    };
    if (formData.id) {
      updateMutation.mutate({ id: formData.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const deleteEmployee = (id) => {
    const e = data.employees.find((x) => x.id === id);
    Modal.confirm({
      title: 'Xoá nhân viên',
      content: `Xoá nhân viên ${e?.name}?`,
      okText: 'Xoá',
      okButtonProps: { danger: true },
      cancelText: 'Huỷ',
      onOk: () => deleteMutation.mutate(id),
    });
  };

  return {
    formOpen,
    editingId,
    openForm,
    closeAll,
    submitEmployee,
    deleteEmployee,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
}
