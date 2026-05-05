import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Radio, Space, Table, Tag, Typography } from 'antd';
import React, { useState } from 'react';
import ServiceFormModal from '../components/modals/ServiceFormModal';
import { useAppStateContext } from '../contexts/AppStateContext';
import { useServices } from '../hooks/useServices';
import { fmtVND } from '../utils';

const CATS = ['all', 'Ăn uống', 'Spa & Wellness', 'Giặt là', 'Đưa đón', 'Khác'];

export default function ServicesPage() {
  const { data, persist } = useAppStateContext();
  const services = useServices(data, persist);
  const [catFilter, setCatFilter] = useState('all');

  let list = data.services;
  if (catFilter !== 'all') list = list.filter(s => s.catalog === catFilter);

  const catOptions = CATS.map(c => ({ label: c === 'all' ? 'Tất cả' : c, value: c }));

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: 'Tên dịch vụ', dataIndex: 'name', render: v => <strong>{v}</strong> },
    { title: 'Danh mục', dataIndex: 'catalog', render: v => <Tag>{v}</Tag> },
    { title: 'Đơn giá', dataIndex: 'price', align: 'right', render: v => <strong>{fmtVND(v)}</strong> },
    { title: 'Lượt dùng (30d)', dataIndex: 'used', align: 'right' },
    { title: '', key: 'edit', render: (_, s) => <Button size="small" onClick={() => services.openForm(s.id)}>Sửa</Button> },
  ];

  return (
    <>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <Typography.Title level={3} style={{ margin: 0 }}>Dịch vụ bổ sung</Typography.Title>
            <Typography.Text type="secondary">Các dịch vụ khách có thể đặt thêm (spa, ăn uống, giặt là, đưa đón…)</Typography.Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => services.openForm()}>Thêm dịch vụ</Button>
        </div>

        <Space style={{ marginBottom: 16 }}>
          <Radio.Group value={catFilter} onChange={e => setCatFilter(e.target.value)} optionType="button" options={catOptions} />
        </Space>

        <Card>
          <Table dataSource={list} columns={columns} rowKey="id" size="small" pagination={false} locale={{ emptyText: 'Không có dịch vụ nào' }} />
        </Card>
      </div>
      <ServiceFormModal
        open={services.formOpen}
        id={services.editingId}
        data={data}
        onClose={services.closeAll}
        onSubmit={services.submitService}
        onDelete={services.deleteService}
      />
    </>
  );
}
