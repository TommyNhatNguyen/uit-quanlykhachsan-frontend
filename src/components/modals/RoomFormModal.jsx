import { Button, Form, Input, InputNumber, Modal, Select, Space } from 'antd';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function RoomFormModal({ open, roomNumber, data, onClose, onSubmit, onDelete }) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const room = roomNumber ? data.rooms.find(r => r.number === roomNumber) : null;

  useEffect(() => {
    if (open) {
      reset({
        number: room?.number || '',
        type: room?.type || 'Standard',
        price: room?.price || undefined,
        capacity: room?.capacity || '2 khách',
        area: room?.area || '',
        smoking: room ? String(room.smoking) : 'false',
        status: room?.status || 'available',
      });
    } else {
      reset();
    }
  }, [open, roomNumber]);

  const onFormSubmit = (values) =>
    onSubmit({ number_old: room?.number || '', ...values, price: values.price });

  const footer = (
    <Space>
      {room && (
        <Button danger type="primary" style={{ marginRight: 'auto' }} onClick={() => onDelete(room.number)}>
          Xoá phòng
        </Button>
      )}
      <Button onClick={onClose}>Huỷ</Button>
      <Button type="primary" onClick={handleSubmit(onFormSubmit)}>Lưu</Button>
    </Space>
  );

  return (
    <Modal open={open} title={room ? `Sửa phòng ${roomNumber}` : 'Thêm phòng'} onCancel={onClose} footer={footer} width={560} destroyOnHidden>
      <Form layout="vertical">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item label="Số phòng" validateStatus={errors.number ? 'error' : ''} help={errors.number?.message}>
            <Controller
              name="number"
              control={control}
              rules={{ required: 'Vui lòng nhập số phòng' }}
              render={({ field }) => <Input {...field} placeholder="VD: 301" />}
            />
          </Form.Item>
          <Form.Item label="Loại phòng" validateStatus={errors.type ? 'error' : ''} help={errors.type?.message}>
            <Controller
              name="type"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select {...field} options={['Standard', 'Deluxe', 'Suite', 'Family'].map(v => ({ value: v }))} />
              )}
            />
          </Form.Item>
          <Form.Item label="Giá/đêm (₫)" validateStatus={errors.price ? 'error' : ''} help={errors.price?.message}>
            <Controller
              name="price"
              control={control}
              rules={{ required: 'Vui lòng nhập giá' }}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0}
                  step={10000}
                  style={{ width: '100%' }}
                  formatter={v => v ? new Intl.NumberFormat('vi-VN').format(v) : ''}
                  parser={v => v.replace(/\D/g, '')}
                />
              )}
            />
          </Form.Item>
          <Form.Item label="Sức chứa">
            <Controller
              name="capacity"
              control={control}
              render={({ field }) => (
                <Select {...field} options={['1 khách', '2 khách', '3 khách', '4 khách', '5 khách'].map(v => ({ value: v }))} />
              )}
            />
          </Form.Item>
          <Form.Item label="Diện tích">
            <Controller
              name="area"
              control={control}
              render={({ field }) => <Input {...field} placeholder="VD: 32m²" />}
            />
          </Form.Item>
          <Form.Item label="Hút thuốc">
            <Controller
              name="smoking"
              control={control}
              render={({ field }) => (
                <Select {...field} options={[{ value: 'false', label: 'Không' }, { value: 'true', label: 'Có' }]} />
              )}
            />
          </Form.Item>
          <Form.Item label="Trạng thái" style={{ gridColumn: '1/-1' }}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select {...field} options={[{ value: 'available', label: 'Trống' }, { value: 'occupied', label: 'Đang ở' }, { value: 'maintenance', label: 'Bảo trì' }]} />
              )}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
