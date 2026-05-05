import { Button, Card, Col, Row, Select, Space, Table, Typography, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useAppStateContext } from '../contexts/AppStateContext';
import { fmtMoneyShort, revenueSeries } from '../utils';

const chartColors = ['#6366f1', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2'];

export default function ReportsPage() {
  const { data } = useAppStateContext();
  const [period, setPeriod] = useState('4/2026');
  const revRef = useRef(null);
  const breakRef = useRef(null);
  const occRef = useRef(null);
  const revChart = useRef(null);
  const breakChart = useRef(null);
  const occChart = useRef(null);

  useEffect(() => {
    if (!revRef.current || !window.Chart) return;
    if (revChart.current) revChart.current.destroy();
    const daysR = period === 'q1/2026' ? 90 : 23;
    const dataR = revenueSeries(daysR).map(s => s.room + s.service);
    revChart.current = new window.Chart(revRef.current, {
      type: 'bar',
      data: { labels: dataR.map((_, i) => `${i + 1}`), datasets: [{ label: 'Doanh thu (triệu ₫)', data: dataR, backgroundColor: '#6366f1', borderRadius: 4 }] },
      options: { maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: v => v + 'M' }, grid: { color: '#f5f5f5' } }, x: { grid: { display: false } } } }
    });
    return () => { revChart.current?.destroy(); };
  }, [period]);

  useEffect(() => {
    if (!breakRef.current || !window.Chart) return;
    if (breakChart.current) breakChart.current.destroy();
    breakChart.current = new window.Chart(breakRef.current, {
      type: 'doughnut',
      data: { labels: ['Phòng', 'Ăn uống', 'Spa', 'Đưa đón', 'Khác'], datasets: [{ data: [68, 15, 8, 6, 3], backgroundColor: chartColors, borderWidth: 0 }] },
      options: { maintainAspectRatio: false, cutout: '62%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, padding: 14 } } } }
    });
    return () => { breakChart.current?.destroy(); };
  }, []);

  useEffect(() => {
    if (!occRef.current || !window.Chart) return;
    if (occChart.current) occChart.current.destroy();
    occChart.current = new window.Chart(occRef.current, {
      type: 'bar',
      data: { labels: ['Standard', 'Deluxe', 'Suite', 'Family'], datasets: [{ label: '%', data: [82, 74, 68, 71], backgroundColor: chartColors, borderRadius: 4 }] },
      options: { indexAxis: 'y', maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { max: 100, ticks: { callback: v => v + '%' }, grid: { color: '#f5f5f5' } }, y: { grid: { display: false } } } }
    });
    return () => { occChart.current?.destroy(); };
  }, []);

  const byRoom = {};
  data.bookings.forEach(b => {
    if (b.status === 'cancelled') return;
    b.rooms.split(',').forEach(n => {
      const num = n.trim();
      byRoom[num] = byRoom[num] || { count: 0, revenue: 0 };
      byRoom[num].count++;
      byRoom[num].revenue += b.amount / b.rooms.split(',').length;
    });
  });
  const topRooms = Object.entries(byRoom)
    .map(([num, v]) => ({ num, ...v, type: (data.rooms.find(r => r.number === num) || {}).type || '—' }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  const exportAll = () => {
    message.info('Đang chuẩn bị file PDF... (demo — cần thư viện jsPDF)');
    setTimeout(() => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'hotel_report.json'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 500);
    }, 600);
  };

  const topRoomColumns = [
    { title: 'Phòng', dataIndex: 'num', render: v => <strong>{v}</strong> },
    { title: 'Loại', dataIndex: 'type' },
    { title: 'Lượt đặt', dataIndex: 'count', align: 'right' },
    { title: 'Doanh thu', dataIndex: 'revenue', align: 'right', render: v => <strong>{fmtMoneyShort(v)} ₫</strong> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>Báo cáo &amp; Phân tích</Typography.Title>
          <Typography.Text type="secondary">Các chỉ số KPI vận hành và tài chính</Typography.Text>
        </div>
        <Space>
          <Select value={period} onChange={setPeriod} style={{ width: 150 }}
            options={[{ value: '4/2026', label: 'Tháng 4/2026' }, { value: '3/2026', label: 'Tháng 3/2026' }, { value: 'q1/2026', label: 'Q1/2026' }]} />
          <Button onClick={exportAll}>Xuất PDF</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={16}>
          <Card title="Doanh thu theo ngày" styles={{ body: { padding: '16px 18px', height: 320 } }}>
            <canvas ref={revRef} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Cơ cấu doanh thu" styles={{ body: { padding: '16px 18px', height: 320 } }}>
            <canvas ref={breakRef} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Top phòng theo doanh thu">
            <Table dataSource={topRooms} columns={topRoomColumns} rowKey="num" size="small" pagination={false} locale={{ emptyText: 'Chưa có dữ liệu' }} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Tỷ lệ lấp đầy theo loại phòng" styles={{ body: { padding: '16px 18px', height: 300 } }}>
            <canvas ref={occRef} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
