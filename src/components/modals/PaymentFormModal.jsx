import { DatePicker, Form, InputNumber, Modal, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { fmtVND } from '../../utils';

export default function PaymentFormModal({ open, data, onClose, onSubmit }) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const cashiers = data.employees.filter(e => e.position === 'Thu ngân' && e.working);
  const unpaidBookings = data.bookings.filter(b => b.payment !== 'paid' && b.status !== 'cancelled');

  useEffect(() => {
    if (open) {
      reset({ datetime: dayjs(), method: 'Tiền mặt', cashier: cashiers[0]?.name });
    } else {
      reset();
    }
  }, [open]);

  const onFormSubmit = (values) => onSubmit({
    bookingId: values.bookingId,
    amount: values.amount,
    method: values.method,
    cashier: values.cashier,
    datetime: values.datetime
      ? values.datetime.format('YYYY-MM-DDTHH:mm')
      : new Date().toISOString().slice(0, 16),
  });

  return (
    <Modal open={open} title="Ghi nhận thanh toán" onCancel={onClose} onOk={handleSubmit(onFormSubmit)} okText="Lưu" cancelText="Huỷ" width={560} destroyOnHidden>
      <Form layout="vertical">
        <Form.Item label="Booking" validateStatus={errors.bookingId ? 'error' : ''} help={errors.bookingId?.message}>
          <Controller
            name="bookingId"
            control={control}
            rules={{ required: 'Vui lòng chọn booking' }}
            render={({ field }) => (
              <Select
                {...field}
                placeholder={unpaidBookings.length === 0 ? 'Không có booking chưa thanh toán' : '-- Chọn booking --'}
                disabled={unpaidBookings.length === 0}
                options={unpaidBookings.map(b => ({ value: b.id, label: `#${b.id} · ${b.customer} · ${fmtVND(b.amount)}` }))}
              />
            )}
          />
        </Form.Item>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item label="Số tiền (₫)" validateStatus={errors.amount ? 'error' : ''} help={errors.amount?.message}>
            <Controller
              name="amount"
              control={control}
              rules={{ required: 'Vui lòng nhập số tiền' }}
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
          <Form.Item label="Phương thức" validateStatus={errors.method ? 'error' : ''} help={errors.method?.message}>
            <Controller
              name="method"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select {...field} options={['Tiền mặt', 'Thẻ', 'QR', 'Chuyển khoản'].map(v => ({ value: v }))} />
              )}
            />
          </Form.Item>
          <Form.Item label="Thu ngân" validateStatus={errors.cashier ? 'error' : ''} help={errors.cashier?.message}>
            <Controller
              name="cashier"
              control={control}
              rules={{ required: 'Vui lòng chọn thu ngân' }}
              render={({ field }) => (
                <Select {...field} options={cashiers.map(e => ({ value: e.name, label: e.name }))} notFoundContent="Không có thu ngân" />
              )}
            />
          </Form.Item>
          <Form.Item label="Thời gian">
            <Controller
              name="datetime"
              control={control}
              render={({ field }) => (
                <DatePicker {...field} showTime style={{ width: '100%' }} format="DD/MM/YYYY HH:mm" />
              )}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
