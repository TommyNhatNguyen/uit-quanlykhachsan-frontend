import { BellOutlined, DownloadOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { AutoComplete, Avatar, Badge, Button, Dropdown, Input, List, Popover, Space, Typography } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStateContext } from '../../contexts/AppStateContext';
import { useBookingContext } from '../../contexts/BookingContext';
import { useCustomerContext } from '../../contexts/CustomerContext';
import { useRoomContext } from '../../contexts/RoomContext';
import { useNotifications } from '../../hooks/useNotifications';
import { fmtDate, fmtVND } from '../../utils';

export default function Topbar() {
  const { data, persist } = useAppStateContext();
  const { openDetail: openBookingDetail } = useBookingContext();
  const { openDetail: openCustomerDetail } = useCustomerContext();
  const { openRoomForm } = useRoomContext();
  const { markAllNotifsRead } = useNotifications(data, persist);
  const navigate = useNavigate();
  const [searchQ, setSearchQ] = useState('');

  const navigateTo = (page) => navigate(page === 'dashboard' ? '/' : `/${page}`);

  const unreadCount = data.notifications.filter(n => n.unread).length;

  const ql = searchQ.toLowerCase();
  const searchOptions = searchQ.length >= 2 ? [
    ...(data.bookings.filter(b => b.id.toLowerCase().includes(ql) || b.customer.toLowerCase().includes(ql)).slice(0, 4).length > 0 ? [{
      label: <Typography.Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Booking</Typography.Text>,
      options: data.bookings.filter(b => b.id.toLowerCase().includes(ql) || b.customer.toLowerCase().includes(ql)).slice(0, 4).map(b => ({
        value: `booking:${b.id}`,
        label: <div><div style={{ fontWeight: 500 }}>📅 #{b.id} · {b.customer}</div><div style={{ fontSize: 11, color: '#8c8c8c' }}>{fmtDate(b.checkin)} → {fmtDate(b.checkout)} · {fmtVND(b.amount)} ₫</div></div>,
      })),
    }] : []),
    ...(data.customers.filter(c => c.name.toLowerCase().includes(ql) || c.phone.includes(ql) || (c.email || '').toLowerCase().includes(ql)).slice(0, 4).length > 0 ? [{
      label: <Typography.Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Khách hàng</Typography.Text>,
      options: data.customers.filter(c => c.name.toLowerCase().includes(ql) || c.phone.includes(ql) || (c.email || '').toLowerCase().includes(ql)).slice(0, 4).map(c => ({
        value: `customer:${c.id}`,
        label: <div><div style={{ fontWeight: 500 }}>👤 {c.name}</div><div style={{ fontSize: 11, color: '#8c8c8c' }}>{c.phone} · {c.tier} · {fmtVND(c.totalPaid)} ₫</div></div>,
      })),
    }] : []),
    ...(data.rooms.filter(r => r.number.includes(ql) || r.type.toLowerCase().includes(ql)).slice(0, 4).length > 0 ? [{
      label: <Typography.Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Phòng</Typography.Text>,
      options: data.rooms.filter(r => r.number.includes(ql) || r.type.toLowerCase().includes(ql)).slice(0, 4).map(r => ({
        value: `room:${r.number}`,
        label: <div><div style={{ fontWeight: 500 }}>🏨 Phòng {r.number}</div><div style={{ fontSize: 11, color: '#8c8c8c' }}>{r.type} · {fmtVND(r.price)}/đêm · {r.status}</div></div>,
      })),
    }] : []),
  ] : [];

  const handleSelect = (value) => {
    const [type, id] = value.split(':');
    setSearchQ('');
    if (type === 'booking') { navigateTo('bookings'); openBookingDetail(id); }
    else if (type === 'customer') { navigateTo('customers'); openCustomerDetail(parseInt(id)); }
    else if (type === 'room') { navigateTo('rooms'); openRoomForm(id); }
  };

  const markNotifRead = (id) => {
    persist({ ...data, notifications: data.notifications.map(n => n.id === id ? { ...n, unread: false } : n) });
  };

  const exportAll = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'hotel_admin_backup.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  };

  const notifContent = (
    <div style={{ width: 320 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Typography.Text strong>Thông báo</Typography.Text>
        <Button type="link" size="small" onClick={markAllNotifsRead}>Đánh dấu đã đọc</Button>
      </div>
      <List
        size="small"
        dataSource={data.notifications}
        renderItem={n => (
          <List.Item
            onClick={() => markNotifRead(n.id)}
            style={{ cursor: 'pointer', background: n.unread ? '#f6f7ff' : 'transparent', padding: '8px 4px', borderRadius: 6, marginBottom: 2 }}
          >
            <Space>
              <span style={{ fontSize: 18 }}>{n.icon}</span>
              <div>
                <Typography.Text strong={n.unread} style={{ fontSize: 12, display: 'block' }}>{n.title}</Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 11 }}>{n.sub} · {n.time}</Typography.Text>
              </div>
            </Space>
          </List.Item>
        )}
        locale={{ emptyText: 'Không có thông báo' }}
      />
    </div>
  );

  const userMenuItems = [
    { key: 'name', label: 'LuongCuong', icon: <UserOutlined />, disabled: true },
    { key: 'email', label: 'cuongquocluong@gmail.com', disabled: true },
    { type: 'divider' },
    { key: 'export', label: 'Xuất toàn bộ dữ liệu', icon: <DownloadOutlined />, onClick: exportAll },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
      <AutoComplete
        style={{ width: 360 }}
        options={searchOptions}
        value={searchQ}
        onChange={setSearchQ}
        onSelect={handleSelect}
        notFoundContent={searchQ.length >= 2 ? `Không tìm thấy kết quả cho "${searchQ}"` : null}
      >
        <Input.Search placeholder="Tìm kiếm booking, khách hàng, phòng…" allowClear />
      </AutoComplete>

      <div style={{ flex: 1 }} />

      <Space size={4}>
        <Popover content={notifContent} trigger="click" placement="bottomRight">
          <Badge count={unreadCount} size="small">
            <Button icon={<BellOutlined />} type="text" />
          </Badge>
        </Popover>

        <Button icon={<SettingOutlined />} type="text" title="Cài đặt" />

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Avatar style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', cursor: 'pointer' }}>LC</Avatar>
        </Dropdown>
      </Space>
    </div>
  );
}
