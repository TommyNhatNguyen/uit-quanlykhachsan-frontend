import { message } from 'antd';
import { paymentMap, statusMap, TODAY } from '../constants';
import { downloadCSV, toCSV } from '../utils';

export function useNotifications(data, persist) {
  const pushNotif = (title, sub, icon = '🔔') => {
    persist({
      ...data,
      notifications: [{ id: Date.now(), title, sub, time: 'Vừa xong', unread: true, icon }, ...data.notifications].slice(0, 15),
    });
  };

  const markNotifRead = (id) => {
    persist({ ...data, notifications: data.notifications.map(n => n.id === id ? { ...n, unread: false } : n) });
  };

  const markAllNotifsRead = () => {
    persist({ ...data, notifications: data.notifications.map(n => ({ ...n, unread: false })) });
    message.success('Đã đánh dấu tất cả đã đọc');
  };

  const exportBookingsCSV = () => {
    const csv = toCSV(data.bookings, [
      { label: 'Mã', key: 'id' },
      { label: 'Khách', key: 'customer' },
      { label: 'Check-in', key: 'checkin' },
      { label: 'Check-out', key: 'checkout' },
      { label: 'Phòng', key: 'rooms' },
      { label: 'Trạng thái', v: b => statusMap[b.status].label },
      { label: 'Thanh toán', v: b => paymentMap[b.payment].label },
      { label: 'Số tiền', key: 'amount' },
    ]);
    downloadCSV(`bookings_${TODAY}.csv`, csv);
    message.success('Đã xuất CSV');
  };

  return { pushNotif, markNotifRead, markAllNotifsRead, exportBookingsCSV };
}
