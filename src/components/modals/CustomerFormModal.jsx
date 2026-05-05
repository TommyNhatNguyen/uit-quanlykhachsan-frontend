import { DatePicker, Form, Input, Modal, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function CustomerFormModal({ open, id, data, onClose, onSubmit }) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const customer = id ? data.customers.find(c => c.id === id) : null;

  useEffect(() => {
    if (open) {
      reset({
        name: customer?.name || '',
        sex: customer?.sex || 'Nam',
        dob: customer?.dob ? dayjs(customer.dob) : null,
        phone: customer?.phone || '',
        email: customer?.email || '',
        notes: customer?.notes || '',
      });
    } else {
      reset();
    }
  }, [open, id]);

  const onFormSubmit = (values) => onSubmit({
    id: customer?.id || '',
    name: values.name,
    sex: values.sex,
    dob: values.dob ? values.dob.format('YYYY-MM-DD') : '',
    phone: values.phone,
    email: values.email || '',
    notes: values.notes || '',
  });

  return (
    <Modal
      open={open}
      title={customer ? `Sửa khách hàng — ${customer.name}` : 'Thêm khách hàng'}
      onCancel={onClose}
      onOk={handleSubmit(onFormSubmit)}
      okText="Lưu"
      cancelText="Huỷ"
      width={560}
      destroyOnHidden
    >
      <Form layout="vertical">
        <Form.Item label="Họ và tên" validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Vui lòng nhập tên' }}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item label="Giới tính">
            <Controller
              name="sex"
              control={control}
              render={({ field }) => (
                <Select {...field} options={[{ value: 'Nam' }, { value: 'Nữ' }, { value: '—' }]} />
              )}
            />
          </Form.Item>
          <Form.Item label="Ngày sinh">
            <Controller
              name="dob"
              control={control}
              render={({ field }) => (
                <DatePicker {...field} style={{ width: '100%' }} format="DD/MM/YYYY" />
              )}
            />
          </Form.Item>
          <Form.Item label="Số điện thoại" validateStatus={errors.phone ? 'error' : ''} help={errors.phone?.message}>
            <Controller
              name="phone"
              control={control}
              rules={{ required: 'Vui lòng nhập SĐT' }}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>
          <Form.Item label="Email">
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>
        </div>
        <Form.Item label="Ghi chú">
          <Controller
            name="notes"
            control={control}
            render={({ field }) => <Input.TextArea {...field} rows={2} />}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
