import { ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Statistic, Table, Tag, Typography, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useAppStateContext } from '../contexts/AppStateContext';
import { useBookingContext } from '../contexts/BookingContext';
import { useCustomerContext } from '../contexts/CustomerContext';
import { statusMap, tierMap, TODAY } from '../constants';
import { fmtMoneyShort, fmtVND, revenueSeries } from '../utils';

export default function DashboardPage() {
  const { data } = useAppStateContext();
  const { openDetail: openBookingDetail } = useBookingContext();
  const { openDetail: openCustomerDetail } = useCustomerContext();
  const [period, setPeriod] = useState(7);
  const revenueRef = useRef(null);
  const roomTypeRef = useRef(null);
  const revenueChart = useRef(null);
  const roomTypeChart = useRef(null);

  const now = new Date();
  const todayBookings = data.bookings.filter(b => b.checkin === TODAY && b.status !== 'cancelled').length;
  const todayRevenue = data.payments.filter(p => p.datetime.startsWith(TODAY) && p.amount > 0).reduce((s, p) => s + p.amount, 0);
  const occ = data.rooms.filter(r => r.status === 'occupied').length;
  const total = data.rooms.length;
  const occupancy = total ? Math.round((occ / total) * 100) : 0;

  const series = revenueSeries(period);
  const totalRev = series.reduce((s, v) => s + v.room + v.service, 0);

  useEffect(() => {
    if (!revenueRef.current || !window.Chart) return;
    if (revenueChart.current) revenueChart.current.destroy();
    const labels = period === 7 ? ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] : series.map((_, i) => `${i + 1}`);
    revenueChart.current = new window.Chart(revenueRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Phòng', data: series.map(s => s.room), borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,.08)', fill: true, tension: .35, borderWidth: 2, pointRadius: period <= 14 ? 3 : 0 },
          { label: 'Dịch vụ', data: series.map(s => s.service), borderColor: '#7c3aed', backgroundColor: 'rgba(124,58,237,.06)', fill: true, tension: .35, borderWidth: 2, pointRadius: period <= 14 ? 3 : 0 },
        ]
      },
      options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, padding: 16 } } }, scales: { y: { beginAtZero: true, ticks: { callback: v => v + 'M' }, grid: { color: '#f5f5f5' } }, x: { grid: { display: false } } } }
    });
    return () => { revenueChart.current?.destroy(); };
  }, [period]);

  useEffect(() => {
    if (!roomTypeRef.current || !window.Chart) return;
    if (roomTypeChart.current) roomTypeChart.current.destroy();
    const typeCounts = ['Standard', 'Deluxe', 'Suite', 'Family'].map(t => data.rooms.filter(r => r.type === t).length);
    roomTypeChart.current = new window.Chart(roomTypeRef.current, {
      type: 'doughnut',
      data: { labels: ['Standard', 'Deluxe', 'Suite', 'Family'], datasets: [{ data: typeCounts, backgroundColor: ['#6366f1', '#7c3aed', '#059669', '#d97706'], borderWidth: 0 }] },
      options: { maintainAspectRatio: false, cutout: '62%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, padding: 14 } } } }
    });
    return () => { roomTypeChart.current?.destroy(); };
  }, [data.rooms]);

  const recent = [...data.bookings].slice(0, 5);
  const topCustomers = [...data.customers].sort((a, b) => b.totalPaid - a.totalPaid).slice(0, 5);

  const bookingColumns = [
    { title: 'Mã', dataIndex: 'id', render: v => <strong>#{v}</strong>, width: 90 },
    { title: 'Khách', dataIndex: 'customer' },
    { title: 'Phòng', dataIndex: 'rooms' },
    { title: 'Trạng thái', dataIndex: 'status', render: v => <Tag color={statusMap[v].color}>{statusMap[v].label}</Tag> },
    { title: 'Tiền', dataIndex: 'amount', align: 'right', render: v => fmtVND(v) },
  ];

  const customerColumns = [
    { title: 'Khách hàng', dataIndex: 'name', render: v => <strong>{v}</strong> },
    { title: 'Hạng', dataIndex: 'tier', render: v => <Tag color={tierMap[v].color}>{v}</Tag> },
    { title: 'Chi tiêu', dataIndex: 'totalPaid', align: 'right', render: v => <strong>{fmtMoneyShort(v)}</strong> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>Dashboard</Typography.Title>
          <Typography.Text type="secondary">Tổng quan hoạt động — cập nhật lúc {String(now.getHours()).padStart(2,'0')}:{String(now.getMinutes()).padStart(2,'0')}</Typography.Text>
        </div>
        <Button icon={<ReloadOutlined />} onClick={() => message.success('Đã làm mới dashboard')}>Làm mới</Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}><Card><Statistic title="📅 Booking hôm nay" value={todayBookings} /></Card></Col>
        <Col xs={24} sm={12} md={6}><Card><Statistic title="💰 Doanh thu hôm nay" value={fmtMoneyShort(todayRevenue)} suffix="₫" /></Card></Col>
        <Col xs={24} sm={12} md={6}><Card><Statistic title="🏨 Tỷ lệ lấp đầy" value={occupancy} suffix="%" /></Card></Col>
        <Col xs={24} sm={12} md={6}><Card><Statistic title="👥 Khách hàng" value={data.customers.length} /></Card></Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={16}>
          <Card
            title={<div><div>Doanh thu {period} ngày qua</div><Typography.Text type="secondary" style={{ fontSize: 12 }}>Tổng: <strong>{fmtMoneyShort(totalRev * 1e6)} ₫</strong></Typography.Text></div>}
            extra={<Space>{[7, 30, 90].map(p => <Button key={p} size="small" type={period === p ? 'primary' : 'default'} onClick={() => setPeriod(p)}>{p} ngày</Button>)}</Space>}
            styles={{ body: { padding: '16px 18px', height: 300 } }}
          >
            <canvas ref={revenueRef} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Phân bố loại phòng" styles={{ body: { padding: '16px 18px', height: 300 } }}>
            <canvas ref={roomTypeRef} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Booking gần đây" extra={<Button type="link" size="small" onClick={() => window.location.hash = '#/bookings'}>Xem tất cả →</Button>}>
            <Table dataSource={recent} columns={bookingColumns} rowKey="id" size="small" pagination={false}
              onRow={r => ({ onClick: () => openBookingDetail(r.id), style: { cursor: 'pointer' } })} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Top khách hàng theo chi tiêu" extra={<Button type="link" size="small" onClick={() => window.location.hash = '#/customers'}>Xem tất cả →</Button>}>
            <Table dataSource={topCustomers} columns={customerColumns} rowKey="id" size="small" pagination={false}
              onRow={r => ({ onClick: () => openCustomerDetail(r.id), style: { cursor: 'pointer' } })} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
