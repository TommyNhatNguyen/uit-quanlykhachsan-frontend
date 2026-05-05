import { message, Modal } from 'antd';
import { useState } from 'react';
import { statusMap, tierForSpend } from '../constants';
import { fmtVND } from '../utils';

export function useBookings(data, persist) {
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [prefillCustomerId, setPrefillCustomerId] = useState(null);

  const openForm = (id = null, customerId = null) => { setEditingId(id); setPrefillCustomerId(customerId); setFormOpen(true); };
  const openDetail = (id) => { setViewingId(id); setDetailOpen(true); };
  const closeAll = () => { setFormOpen(false); setDetailOpen(false); setEditingId(null); setViewingId(null); setPrefillCustomerId(null); };

  const submitBooking = (formData) => {
    const customer = data.customers.find(c => c.id === +formData.customerId);
    const room = data.rooms.find(r => r.number === formData.room);
    if (!customer || !room) { message.error('Dữ liệu không hợp lệ'); return; }

    const nights = Math.max(1, Math.round((new Date(formData.checkout) - new Date(formData.checkin)) / 86400000));
    const amount = nights * room.price * Math.max(1, +formData.quantity);

    let newData;
    if (formData.id) {
      newData = {
        ...data,
        bookings: data.bookings.map(b => b.id === formData.id
          ? { ...b, customerId: customer.id, customer: customer.name, checkin: formData.checkin, checkout: formData.checkout, rooms: formData.room, amount, notes: formData.notes || '' }
          : b),
      };
      message.success(`Đã cập nhật booking #${formData.id}`);
    } else {
      const newId = 'BK-' + data.counters.booking;
      newData = {
        ...data,
        bookings: [{ id: newId, customerId: customer.id, customer: customer.name, checkin: formData.checkin, checkout: formData.checkout, rooms: formData.room, status: 'pending', payment: 'unpaid', amount, notes: formData.notes || '' }, ...data.bookings],
        notifications: [{ id: Date.now(), title: `Booking mới #${newId}`, sub: `${customer.name} · ${fmtVND(amount)} ₫`, time: 'Vừa xong', unread: true, icon: '📅' }, ...data.notifications].slice(0, 15),
        counters: { ...data.counters, booking: data.counters.booking + 1 },
      };
      message.success(`Đã tạo booking #${newId}`);
    }
    persist(newData);
    closeAll();
  };

  const changeBookingStatus = (id, newStatus) => {
    let newData = { ...data };
    newData.bookings = data.bookings.map(b => {
      if (b.id !== id) return b;
      const updated = { ...b, status: newStatus };
      if (newStatus === 'checked_out') updated.payment = 'paid';
      return updated;
    });

    const booking = data.bookings.find(b => b.id === id);
    if (booking) {
      if (newStatus === 'checked_in') {
        newData.rooms = data.rooms.map(r =>
          booking.rooms.split(',').map(n => n.trim()).includes(r.number) ? { ...r, status: 'occupied' } : r);
      } else if (newStatus === 'checked_out') {
        newData.rooms = data.rooms.map(r =>
          booking.rooms.split(',').map(n => n.trim()).includes(r.number) ? { ...r, status: 'available' } : r);
        newData.customers = data.customers.map(c => {
          if (c.id !== booking.customerId) return c;
          const newTotal = c.totalPaid + booking.amount;
          return { ...c, totalPaid: newTotal, tier: tierForSpend(newTotal) };
        });
      }
    }
    persist(newData);
    message.success(`Đã chuyển booking #${id} → ${statusMap[newStatus].label}`);
  };

  const cancelBooking = (id) => {
    Modal.confirm({
      title: 'Huỷ booking',
      content: `Huỷ booking #${id}? Hành động này không thể hoàn tác.`,
      okText: 'Huỷ booking', okButtonProps: { danger: true },
      cancelText: 'Không',
      onOk: () => {
        persist({ ...data, bookings: data.bookings.map(b => b.id === id ? { ...b, status: 'cancelled', payment: b.payment === 'paid' ? 'refunded' : b.payment, amount: 0 } : b) });
        message.warning(`Đã huỷ booking #${id}`);
      },
    });
  };

  const deleteBooking = (id) => {
    Modal.confirm({
      title: 'Xoá booking',
      content: `Xoá vĩnh viễn booking #${id}?`,
      okText: 'Xoá', okButtonProps: { danger: true },
      cancelText: 'Huỷ',
      onOk: () => {
        persist({ ...data, bookings: data.bookings.filter(b => b.id !== id) });
        message.success(`Đã xoá booking #${id}`);
      },
    });
  };

  return { formOpen, detailOpen, editingId, viewingId, prefillCustomerId, openForm, openDetail, closeAll, submitBooking, changeBookingStatus, cancelBooking, deleteBooking };
}
