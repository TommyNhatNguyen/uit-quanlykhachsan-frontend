import { Button, DatePicker, Form, Input, Modal, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TODAY } from '../../constants';

const POSITIONS = ['Lễ tân', 'Thu ngân', 'Buồng phòng', 'Quản lý', 'Bảo vệ'];

export default function EmployeeFormModal({ open, id, data, onClose, onSubmit, onDelete }) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const employee = id ? data.employees.find(e => e.id === id) : null;

  useEffect(() => {
    if (open) {
      reset({
        name: employee?.name || '',
        dob: employee?.dob ? dayjs(employee.dob) : null,
        phone: employee?.phone || '',
        position: employee?.position || 'Lễ tân',
        start: dayjs(employee?.start || TODAY),
        working: employee ? String(employee.working) : 'true',
      });
    } else {
      reset();
    }
  }, [open, id]);

  const onFormSubmit = (values) => onSubmit({
    id: employee?.id || '',
    name: values.name,
    dob: values.dob ? values.dob.format('YYYY-MM-DD') : '',
    phone: values.phone,
    position: values.position,
    start: values.start ? values.start.format('YYYY-MM-DD') : TODAY,
    working: values.working,
  });

  const footer = (
    <Space>
      {employee && (
        <Button danger type="primary" style={{ marginRight: 'auto' }} onClick={() => onDelete(employee.id)}>
          Xoá
        </Button>
      )}
      <Button onClick={onClose}>Huỷ</Button>
      <Button type="primary" onClick={handleSubmit(onFormSubmit)}>Lưu</Button>
    </Space>
  );

  return (
    <Modal open={open} title={employee ? `Hồ sơ — ${employee.name}` : 'Thêm nhân viên'} onCancel={onClose} footer={footer} width={560} destroyOnHidden>
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
          <Form.Item label="Vị trí" validateStatus={errors.position ? 'error' : ''} help={errors.position?.message}>
            <Controller
              name="position"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select {...field} options={POSITIONS.map(v => ({ value: v }))} />
              )}
            />
          </Form.Item>
          <Form.Item label="Ngày bắt đầu">
            <Controller
              name="start"
              control={control}
              render={({ field }) => (
                <DatePicker {...field} style={{ width: '100%' }} format="DD/MM/YYYY" />
              )}
            />
          </Form.Item>
          <Form.Item label="Trạng thái" style={{ gridColumn: '1/-1' }}>
            <Controller
              name="working"
              control={control}
              render={({ field }) => (
                <Select {...field} options={[{ value: 'true', label: 'Đang làm việc' }, { value: 'false', label: 'Đã nghỉ' }]} />
              )}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
