import { Button, Form, Input, InputNumber, Modal, Select, Space } from 'antd';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

const CATALOGS = ['Ăn uống', 'Spa & Wellness', 'Giặt là', 'Đưa đón', 'Khác'];

export default function ServiceFormModal({ open, id, data, onClose, onSubmit, onDelete }) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const service = id ? data.services.find(s => s.id === id) : null;

  useEffect(() => {
    if (open) {
      reset({
        name: service?.name || '',
        catalog: service?.catalog || 'Ăn uống',
        price: service?.price || undefined,
      });
    } else {
      reset();
    }
  }, [open, id]);

  const onFormSubmit = (values) =>
    onSubmit({ id: service?.id || '', ...values, price: values.price });

  const footer = (
    <Space>
      {service && (
        <Button danger type="primary" style={{ marginRight: 'auto' }} onClick={() => onDelete(service.id)}>
          Xoá
        </Button>
      )}
      <Button onClick={onClose}>Huỷ</Button>
      <Button type="primary" onClick={handleSubmit(onFormSubmit)}>Lưu</Button>
    </Space>
  );

  return (
    <Modal open={open} title={service ? 'Sửa dịch vụ' : 'Thêm dịch vụ'} onCancel={onClose} footer={footer} width={440} destroyOnHidden>
      <Form layout="vertical">
        <Form.Item label="Tên dịch vụ" validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Vui lòng nhập tên' }}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item label="Danh mục" validateStatus={errors.catalog ? 'error' : ''} help={errors.catalog?.message}>
          <Controller
            name="catalog"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select {...field} options={CATALOGS.map(v => ({ value: v }))} />
            )}
          />
        </Form.Item>
        <Form.Item label="Đơn giá (₫)" validateStatus={errors.price ? 'error' : ''} help={errors.price?.message}>
          <Controller
            name="price"
            control={control}
            rules={{ required: 'Vui lòng nhập giá' }}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                step={1000}
                style={{ width: '100%' }}
                formatter={v => v ? new Intl.NumberFormat('vi-VN').format(v) : ''}
                parser={v => v.replace(/\D/g, '')}
              />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
