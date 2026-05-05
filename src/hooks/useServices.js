import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message, Modal } from 'antd';
import { useState } from 'react';
import { serviceItemsApi } from '../api/serviceItems';

export function useServices(data, persist) {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const openForm = (id = null) => { setEditingId(id); setFormOpen(true); };
  const closeAll = () => { setFormOpen(false); setEditingId(null); };

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['state'] });

  const createMutation = useMutation({
    mutationFn: (payload) => serviceItemsApi.create(payload),
    onSuccess: () => {
      invalidate();
      message.success('Đã thêm dịch vụ');
      closeAll();
    },
    onError: (err) => message.error(err.message || 'Lỗi khi thêm dịch vụ'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => serviceItemsApi.update(id, payload),
    onSuccess: () => {
      invalidate();
      message.success('Đã cập nhật dịch vụ');
      closeAll();
    },
    onError: (err) => message.error(err.message || 'Lỗi khi cập nhật dịch vụ'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => serviceItemsApi.delete(id),
    onSuccess: () => {
      invalidate();
      message.success('Đã xoá dịch vụ');
      closeAll();
    },
    onError: (err) => message.error(err.message || 'Lỗi khi xoá dịch vụ'),
  });

  const submitService = (formData) => {
    const payload = {
      service_item_name: formData.name,
      catalog: formData.catalog,
      price: +formData.price,
    };
    if (formData.id) {
      updateMutation.mutate({ id: +formData.id, payload });
    } else {
      createMutation.mutate({ ...payload, used_count: 0 });
    }
  };

  const deleteService = (id) => {
    const s = data.services.find((x) => x.id === id);
    Modal.confirm({
      title: 'Xoá dịch vụ',
      content: `Xoá dịch vụ ${s?.name}?`,
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
    submitService,
    deleteService,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
}
