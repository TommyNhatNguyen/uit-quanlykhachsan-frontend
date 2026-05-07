import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Radio, Row, Select, Space, Table, Tabs, Tag, Typography } from 'antd';
import React, { useState } from 'react';
import { useAppStateContext } from '../contexts/AppStateContext';
import { useRoomContext } from '../contexts/RoomContext';
import { fmtDate, fmtVND } from '../utils';

const roomStatusColor = { available: '#52c41a', occupied: '#faad14', maintenance: '#ff4d4f' };
const roomStatusLabel = { available: 'Trống', occupied: 'Đang ở', maintenance: 'Bảo trì' };
const roomStatusTagColor = { available: 'green', occupied: 'gold', maintenance: 'red' };

export default function RoomsPage() {
  const { data } = useAppStateContext();
  const rooms = useRoomContext();
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('grid');

  const counts = {
    all: data.rooms.length,
    available: data.rooms.filter(r => r.status === 'available').length,
    occupied: data.rooms.filter(r => r.status === 'occupied').length,
    maintenance: data.rooms.filter(r => r.status === 'maintenance').length,
  };

  let filtered = data.rooms;
  if (statusFilter !== 'all') filtered = filtered.filter(r => r.status === statusFilter);
  if (typeFilter !== 'all') filtered = filtered.filter(r => r.type === typeFilter);

  const statusOptions = [
    { label: `Tất cả · ${counts.all}`, value: 'all' },
    { label: `Trống · ${counts.available}`, value: 'available' },
    { label: `Đang ở · ${counts.occupied}`, value: 'occupied' },
    { label: `Bảo trì · ${counts.maintenance}`, value: 'maintenance' },
  ];

  const filterBar = (
    <Space wrap style={{ marginBottom: 16 }}>
      <Radio.Group value={statusFilter} onChange={e => setStatusFilter(e.target.value)} optionType="button" options={statusOptions} />
      <Select value={typeFilter} onChange={setTypeFilter} style={{ width: 160 }}
        options={[{ value: 'all', label: 'Tất cả loại phòng' }, ...['Standard', 'Deluxe', 'Suite', 'Family'].map(v => ({ value: v }))]} />
    </Space>
  );

  const gridView = (
    <>
      {filterBar}
      <Row gutter={[12, 12]}>
        {filtered.length === 0 ? (
          <Col span={24}><Typography.Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: 40 }}>Không có phòng nào</Typography.Text></Col>
        ) : filtered.map(r => (
          <Col key={r.number} xs={12} sm={8} md={6} lg={4}>
            <Card
              hoverable
              size="small"
              onClick={() => rooms.openRoomForm(r.number)}
              style={{ borderLeft: `3px solid ${roomStatusColor[r.status]}`, cursor: 'pointer' }}
            >
              <div style={{ fontWeight: 700, fontSize: 15 }}>{r.number}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{r.type} · {r.capacity}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{fmtVND(r.price)}/đêm</div>
              <div style={{ fontSize: 12, color: roomStatusColor[r.status], marginTop: 4, fontWeight: 500 }}>● {roomStatusLabel[r.status]}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );

  const listColumns = [
    { title: 'Số phòng', dataIndex: 'number', render: v => <strong>{v}</strong> },
    { title: 'Loại', dataIndex: 'type' },
    { title: 'Sức chứa', dataIndex: 'capacity' },
    { title: 'Diện tích', dataIndex: 'area' },
    { title: 'Hút thuốc', dataIndex: 'smoking', render: v => v ? 'Có' : 'Không' },
    { title: 'Giá/đêm', dataIndex: 'price', align: 'right', render: v => <strong>{fmtVND(v)}</strong> },
    { title: 'Trạng thái', dataIndex: 'status', render: v => <Tag color={roomStatusTagColor[v]}>{roomStatusLabel[v]}</Tag> },
    { title: '', key: 'edit', render: (_, r) => <Button size="small" onClick={() => rooms.openRoomForm(r.number)}>Sửa</Button> },
  ];

  const listView = (
    <>
      {filterBar}
      <Card>
        <Table dataSource={filtered} columns={listColumns} rowKey="number" size="small" pagination={false} locale={{ emptyText: 'Không có phòng nào' }} />
      </Card>
    </>
  );

  const priceColumns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: 'Phòng', dataIndex: 'roomNumber', render: (v) => { const r = data.rooms.find(x => x.number === v); return <strong>{v}{r ? ` · ${r.type}` : ''}</strong>; } },
    { title: 'Áp dụng từ', dataIndex: 'from', render: fmtDate },
    { title: 'Áp dụng đến', dataIndex: 'to', render: v => v ? fmtDate(v) : '—' },
    { title: 'Giá/đêm', dataIndex: 'price', align: 'right', render: v => <strong>{fmtVND(v)}</strong> },
  ];

  const priceView = (
    <Card
      title="Lịch sử biến động giá"
      extra={<Button size="small" type="primary" icon={<PlusOutlined />} onClick={rooms.openPriceForm}>Áp giá mới</Button>}
    >
      <Table dataSource={data.priceLogs} columns={priceColumns} rowKey="id" size="small" pagination={false} locale={{ emptyText: 'Chưa có lịch sử giá' }} />
    </Card>
  );

  const tabItems = [
    { key: 'grid', label: 'Lưới phòng', children: gridView },
    { key: 'list', label: 'Danh sách chi tiết', children: listView },
    { key: 'price', label: 'Bảng giá', children: priceView },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>Quản lý phòng</Typography.Title>
          <Typography.Text type="secondary">Tình trạng phòng hiện tại, đơn giá, và lịch sử biến động giá</Typography.Text>
        </div>
        <Space>
          <Button onClick={() => setActiveTab('price')}>Lịch sử giá phòng</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => rooms.openRoomForm()}>Thêm phòng</Button>
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
    </div>
  );
}
