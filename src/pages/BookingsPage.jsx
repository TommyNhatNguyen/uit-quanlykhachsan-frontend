import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Dropdown, Input, Radio, Space, Table, Tag, Typography } from 'antd';
import React, { useState } from 'react';
import { useAppStateContext } from '../contexts/AppStateContext';
import { useBookingContext } from '../contexts/BookingContext';
import { paymentMap, statusMap, TODAY } from '../constants';
import { downloadCSV, fmtDate, fmtVND, toCSV } from '../utils';

export default function BookingsPage() {
  const { data } = useAppStateContext();
  const bookings = useBookingContext();
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(null);
  const [search, setSearch] = useState('');

  const counts = { all: data.bookings.length };
  Object.keys(statusMap).forEach(k => { counts[k] = data.bookings.filter(b => b.status === k).length; });

  let list = data.bookings;
  if (statusFilter !== 'all') list = list.filter(b => b.status === statusFilter);
  if (dateFilter) { const d = dateFilter.format('YYYY-MM-DD'); list = list.filter(b => b.checkin <= d && b.checkout >= d); }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(b => b.id.toLowerCase().includes(q) || b.customer.toLowerCase().includes(q) || b.rooms.toLowerCase().includes(q));
  }

  const exportCSV = () => {
    const csv = toCSV(data.bookings, [
      { label: 'Mã', key: 'id' }, { label: 'Khách', key: 'customer' },
      { label: 'Check-in', key: 'checkin' }, { label: 'Check-out', key: 'checkout' },
      { label: 'Phòng', key: 'rooms' },
      { label: 'Trạng thái', v: b => statusMap[b.status].label },
      { label: 'Thanh toán', v: b => paymentMap[b.payment].label },
      { label: 'Số tiền', key: 'amount' },
    ]);
    downloadCSV(`bookings_${TODAY}.csv`, csv);
  };

  const buildActions = (b) => {
    const items = [
      { key: 'detail', label: '👁 Xem chi tiết', onClick: () => bookings.openDetail(b.id) },
      { key: 'edit', label: '✎ Sửa', onClick: () => bookings.openForm(b.id) },
    ];
    if (b.status === 'pending') items.push({ key: 'confirm', label: '✓ Xác nhận', onClick: () => bookings.changeBookingStatus(b.id, 'confirmed') });
    if (b.status === 'confirmed') items.push({ key: 'checkin', label: '🔑 Check-in', onClick: () => bookings.changeBookingStatus(b.id, 'checked_in') });
    if (b.status === 'checked_in') items.push({ key: 'checkout', label: '🚪 Check-out', onClick: () => bookings.changeBookingStatus(b.id, 'checked_out') });
    if (['pending', 'confirmed'].includes(b.status)) {
      items.push({ type: 'divider' });
      items.push({ key: 'cancel', label: '✕ Huỷ booking', danger: true, onClick: () => bookings.cancelBooking(b.id) });
    }
    items.push({ type: 'divider' });
    items.push({ key: 'delete', label: '🗑 Xoá', danger: true, onClick: () => bookings.deleteBooking(b.id) });
    return items;
  };

  const statusOptions = [
    { label: `Tất cả · ${counts.all}`, value: 'all' },
    ...Object.entries(statusMap).map(([k, v]) => ({ label: `${v.label} · ${counts[k] || 0}`, value: k })),
  ];

  const columns = [
    { title: 'Mã booking', dataIndex: 'id', render: v => <strong>#{v}</strong>, width: 110 },
    { title: 'Khách hàng', dataIndex: 'customer' },
    { title: 'Check-in', dataIndex: 'checkin', render: fmtDate },
    { title: 'Check-out', dataIndex: 'checkout', render: fmtDate },
    { title: 'Phòng', dataIndex: 'rooms' },
    { title: 'Trạng thái', dataIndex: 'status', render: v => <Tag color={statusMap[v].color}>{statusMap[v].label}</Tag> },
    { title: 'Thanh toán', dataIndex: 'payment', render: v => <Tag color={paymentMap[v].color}>{paymentMap[v].label}</Tag> },
    { title: 'Tổng tiền', dataIndex: 'amount', align: 'right', render: v => <strong>{fmtVND(v)}</strong> },
    {
      title: '', key: 'actions', width: 50,
      render: (_, b) => (
        <Dropdown menu={{ items: buildActions(b) }} trigger={['click']}>
          <Button size="small" type="text" onClick={e => e.stopPropagation()}>⋯</Button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>Quản lý đặt phòng</Typography.Title>
          <Typography.Text type="secondary">Tất cả booking trong hệ thống — lọc, tìm kiếm, tạo mới và cập nhật trạng thái</Typography.Text>
        </div>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={exportCSV}>Xuất CSV</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => bookings.openForm()}>Booking mới</Button>
        </Space>
      </div>

      <Space wrap style={{ marginBottom: 16 }}>
        <Radio.Group value={statusFilter} onChange={e => setStatusFilter(e.target.value)} optionType="button" options={statusOptions} />
        <Input.Search placeholder="Tìm mã, khách hàng…" style={{ width: 220 }} value={search} onChange={e => setSearch(e.target.value)} allowClear />
        <DatePicker placeholder="Lọc theo ngày" value={dateFilter} onChange={setDateFilter} format="DD/MM/YYYY" />
        <Button onClick={() => { setStatusFilter('all'); setDateFilter(null); setSearch(''); }}>Xoá lọc</Button>
      </Space>

      <Card>
        <Table
          dataSource={list}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 20, showSizeChanger: false }}
          locale={{ emptyText: 'Không có booking nào khớp bộ lọc' }}
          onRow={b => ({ onClick: () => bookings.openDetail(b.id), style: { cursor: 'pointer' } })}
        />
      </Card>
    </div>
  );
}
