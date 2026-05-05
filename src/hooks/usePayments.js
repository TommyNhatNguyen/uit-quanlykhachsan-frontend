import { message } from 'antd';
import { useState } from 'react';
import { fmtVND } from '../utils';

export function usePayments(data, persist) {
  const [formOpen, setFormOpen] = useState(false);

  const openForm = () => setFormOpen(true);
  const closeAll = () => setFormOpen(false);

  const submitPayment = (formData) => {
    const booking = data.bookings.find(b => b.id === formData.bookingId);
    if (!booking) { message.error('Booking không tồn tại'); return; }

    const id = 'PAY-' + data.counters.payment;
    const newPayment = { id, bookingId: booking.id, customer: booking.customer, method: formData.method, cashier: formData.cashier, datetime: formData.datetime || new Date().toISOString().slice(0, 16), amount: +formData.amount, status: 'success' };
    const allPayments = [newPayment, ...data.payments];
    const totalPaid = allPayments.filter(p => p.bookingId === booking.id && p.amount > 0).reduce((s, p) => s + p.amount, 0);
    const newPaymentStatus = totalPaid >= booking.amount ? 'paid' : totalPaid > 0 ? 'partial' : 'unpaid';

    persist({
      ...data,
      payments: allPayments,
      bookings: data.bookings.map(b => b.id === booking.id ? { ...b, payment: newPaymentStatus } : b),
      notifications: [{ id: Date.now(), title: 'Thanh toán mới', sub: `${id} — ${fmtVND(+formData.amount)} ₫`, time: 'Vừa xong', unread: true, icon: '💳' }, ...data.notifications].slice(0, 15),
      counters: { ...data.counters, payment: data.counters.payment + 1 },
    });
    message.success(`Đã ghi nhận thanh toán ${fmtVND(+formData.amount)} ₫`);
    closeAll();
  };

  return { formOpen, openForm, closeAll, submitPayment };
}
