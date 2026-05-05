import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Row, Select, Space, Statistic, Table, Tag, Typography } from 'antd';
import React, { useState } from 'react';
import PaymentFormModal from '../components/modals/PaymentFormModal';
import { useAppStateContext } from '../contexts/AppStateContext';
import { usePayments } from '../hooks/usePayments';
import { TODAY } from '../constants';
import { downloadCSV, fmtDateTime, fmtMoneyShort, fmtVND, toCSV } from '../utils';

export default function PaymentsPage() {
  const { data, persist } = useAppStateContext();
  const payments = usePayments(data, persist);
  const [dateFilter, setDateFilter] = useState(null);
  const [methodFilter, setMethodFilter] = useState('all');
  const [cashierFilter, setCashierFilter] = useState('all');

  const cashiers = [...new Set(data.employees.filter(e => e.position === 'Thu ngân').map(e => e.name))];

  let list = data.payments;
  if (dateFilter) list = list.filter(p => p.datetime.startsWith(dateFilter.format('YYYY-MM-DD')));
  if (methodFilter !== 'all') list = list.filter(p => p.method === methodFilter);
  if (cashierFilter !== 'all') list = list.filter(p => p.cashier === cashierFilter);

  const today = data.payments.filter(p => p.datetime.startsWith(TODAY) && p.amount > 0);
  const sum = today.reduce((s, p) => s + p.amount, 0);
  const byMethod = m => today.filter(p => p.method === m).reduce((s, p) => s + p.amount, 0);
  const cash = byMethod('Tiền mặt');
  const card = byMethod('Thẻ') + byMethod('QR');
  const bank = byMethod('Chuyển khoản');

  const exportCSV = () => {
    const csv = toCSV(data.payments, [
      { label: 'Mã GD', key: 'id' }, { label: 'Booking', key: 'bookingId' },
      { label: 'Khách', key: 'customer' }, { label: 'Phương thức', key: 'method' },
      { label: 'Thu ngân', key: 'cashier' }, { label: 'Thời gian', key: 'datetime' },
      { label: 'Số tiền', key: 'amount' }, { label: 'Trạng thái', key: 'status' },
    ]);
    downloadCSV(`payments_${TODAY}.csv`, csv);
  };

  const columns = [
    { title: 'Mã GD', dataIndex: 'id', render: v => <strong>{v}</strong>, width: 100 },
    { title: 'Booking', dataIndex: 'bookingId', render: v => `#${v}` },
    { title: 'Khách hàng', dataIndex: 'customer' },
    { title: 'Phương thức', dataIndex: 'method', render: v => <Tag>{v}</Tag> },
    { title: 'Thu ngân', dataIndex: 'cashier' },
    { title: 'Thời gian', dataIndex: 'datetime', render: fmtDateTime },
    { title: 'Số tiền', dataIndex: 'amount', align: 'right', render: v => <strong style={v < 0 ? { color: '#ff4d4f' } : {}}>{fmtVND(v)}</strong> },
    { title: 'Trạng thái', dataIndex: 'status', render: v => <Tag color={v === 'refund' ? 'red' : 'green'}>{v === 'refund' ? 'Hoàn tiền' : 'Thành công'}</Tag> },
  ];

  return (
    <>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <Typography.Title level={3} style={{ margin: 0 }}>Thanh toán</Typography.Title>
            <Typography.Text type="secondary">Lịch sử giao dịch, phương thức và thu ngân</Typography.Text>
          </div>
          <Space>
            <Button icon={<DownloadOutlined />} onClick={exportCSV}>Xuất CSV</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={payments.openForm}>Ghi nhận thanh toán</Button>
          </Space>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}><Card><Statistic title="Thu hôm nay" value={fmtMoneyShort(sum)} suffix="₫" /></Card></Col>
          <Col xs={24} sm={12} md={6}><Card><Statistic title="Tiền mặt" value={fmtMoneyShort(cash)} suffix="₫" /></Card></Col>
          <Col xs={24} sm={12} md={6}><Card><Statistic title="Thẻ / QR" value={fmtMoneyShort(card)} suffix="₫" /></Card></Col>
          <Col xs={24} sm={12} md={6}><Card><Statistic title="Chuyển khoản" value={fmtMoneyShort(bank)} suffix="₫" /></Card></Col>
        </Row>

        <Space wrap style={{ marginBottom: 16 }}>
          <DatePicker placeholder="Lọc ngày" value={dateFilter} onChange={setDateFilter} format="DD/MM/YYYY" />
          <Select value={methodFilter} onChange={setMethodFilter} style={{ width: 160 }}
            options={[{ value: 'all', label: 'Tất cả phương thức' }, ...['Tiền mặt', 'Thẻ', 'QR', 'Chuyển khoản'].map(v => ({ value: v }))]} />
          <Select value={cashierFilter} onChange={setCashierFilter} style={{ width: 160 }}
            options={[{ value: 'all', label: 'Tất cả thu ngân' }, ...cashiers.map(c => ({ value: c }))]} />
          <Button onClick={() => { setDateFilter(null); setMethodFilter('all'); setCashierFilter('all'); }}>Xoá lọc</Button>
        </Space>

        <Card>
          <Table dataSource={list} columns={columns} rowKey="id" size="small" pagination={{ pageSize: 20, showSizeChanger: false }} locale={{ emptyText: 'Không có giao dịch nào' }} />
        </Card>
      </div>
      <PaymentFormModal
        open={payments.formOpen}
        data={data}
        onClose={payments.closeAll}
        onSubmit={payments.submitPayment}
      />
    </>
  );
}
