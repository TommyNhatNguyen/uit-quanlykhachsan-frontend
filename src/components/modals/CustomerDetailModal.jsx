import { Avatar, Button, Descriptions, Modal, Space, Table, Tag, Typography } from 'antd';
import React from 'react';
import { statusMap, tierMap } from '../../constants';
import { fmtDate, fmtVND } from '../../utils';

export default function CustomerDetailModal({ open, customer, data, onClose, onEdit }) {
  if (!customer) return null;
  const bookings = data.bookings.filter(b => b.customerId === customer.id);
  const initials = customer.name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase();

  const columns = [
    { title: 'Mã', dataIndex: 'id', render: v => <strong>#{v}</strong>, width: 100 },
    { title: 'Check-in', dataIndex: 'checkin', render: fmtDate },
    { title: 'Check-out', dataIndex: 'checkout', render: fmtDate },
    { title: 'Trạng thái', dataIndex: 'status', render: v => <Tag color={statusMap[v].color}>{statusMap[v].label}</Tag> },
    { title: 'Tiền', dataIndex: 'amount', align: 'right', render: v => fmtVND(v) },
  ];

  return (
    <Modal
      open={open}
      title="Hồ sơ khách hàng"
      onCancel={onClose}
      footer={<Space><Button onClick={onClose}>Đóng</Button><Button type="primary" onClick={() => { onClose(); onEdit(customer.id); }}>Sửa</Button></Space>}
      width={760}
      destroyOnHidden
    >
      <Space style={{ marginBottom: 18 }} align="start">
        <Avatar size={50} style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', fontSize: 18, fontWeight: 600 }}>{initials}</Avatar>
        <div style={{ flex: 1 }}>
          <Typography.Title level={5} style={{ margin: 0 }}>{customer.name}</Typography.Title>
          <Typography.Text type="secondary">{customer.phone} · {customer.email || '—'}</Typography.Text>
        </div>
        <Tag color={tierMap[customer.tier].color} style={{ fontSize: 12, padding: '4px 10px' }}>{customer.tier}</Tag>
      </Space>

      <Descriptions column={2} size="small" bordered style={{ marginBottom: 18 }}>
        <Descriptions.Item label="Tổng chi tiêu">{fmtVND(customer.totalPaid)} ₫</Descriptions.Item>
        <Descriptions.Item label="Số lần đặt">{bookings.length}</Descriptions.Item>
        <Descriptions.Item label="Giới tính">{customer.sex}</Descriptions.Item>
        <Descriptions.Item label="Ngày sinh">{fmtDate(customer.dob)}</Descriptions.Item>
      </Descriptions>

      <Typography.Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>Lịch sử booking ({bookings.length})</Typography.Text>
      <Table
        dataSource={bookings}
        columns={columns}
        rowKey="id"
        size="small"
        pagination={false}
        locale={{ emptyText: 'Chưa có booking' }}
      />

      {customer.notes && (
        <div style={{ marginTop: 14, padding: 12, background: '#fafbfc', borderRadius: 8, fontSize: 13 }}>
          <strong>Ghi chú:</strong> {customer.notes}
        </div>
      )}
    </Modal>
  );
}
