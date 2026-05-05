import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Input, Radio, Select, Space, Table, Tag, Typography } from 'antd';
import React, { useState } from 'react';
import EmployeeFormModal from '../components/modals/EmployeeFormModal';
import { useAppStateContext } from '../contexts/AppStateContext';
import { useEmployees } from '../hooks/useEmployees';
import { fmtDate } from '../utils';

export default function EmployeesPage() {
  const { data, persist } = useAppStateContext();
  const employees = useEmployees(data, persist);
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const [workingFilter, setWorkingFilter] = useState('working');

  let list = data.employees;
  if (positionFilter !== 'all') list = list.filter(e => e.position === positionFilter);
  if (workingFilter === 'working') list = list.filter(e => e.working);
  else if (workingFilter === 'left') list = list.filter(e => !e.working);
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(e => e.name.toLowerCase().includes(q) || e.phone.includes(q));
  }

  const columns = [
    { title: 'Mã NV', dataIndex: 'id', render: v => <strong>{v}</strong>, width: 100 },
    { title: 'Họ tên', dataIndex: 'name' },
    { title: 'Ngày sinh', dataIndex: 'dob', render: fmtDate },
    { title: 'SĐT', dataIndex: 'phone' },
    { title: 'Vị trí', dataIndex: 'position', render: v => <Tag>{v}</Tag> },
    { title: 'Bắt đầu', dataIndex: 'start', render: fmtDate },
    { title: 'Trạng thái', dataIndex: 'working', render: v => <Tag color={v ? 'green' : 'default'}>{v ? 'Đang làm' : 'Đã nghỉ'}</Tag> },
    { title: '', key: 'edit', render: (_, e) => <Button size="small" onClick={() => employees.openForm(e.id)}>Hồ sơ</Button> },
  ];

  return (
    <>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <Typography.Title level={3} style={{ margin: 0 }}>Nhân viên</Typography.Title>
            <Typography.Text type="secondary">Danh sách nhân sự, vị trí và trạng thái làm việc</Typography.Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => employees.openForm()}>Thêm nhân viên</Button>
        </div>

        <Space wrap style={{ marginBottom: 16 }}>
          <Input.Search placeholder="Tìm theo tên, SĐT…" style={{ width: 260 }} value={search} onChange={e => setSearch(e.target.value)} allowClear />
          <Select value={positionFilter} onChange={setPositionFilter} style={{ width: 160 }}
            options={[{ value: 'all', label: 'Tất cả vị trí' }, ...['Lễ tân', 'Thu ngân', 'Buồng phòng', 'Quản lý'].map(v => ({ value: v }))]} />
          <Radio.Group value={workingFilter} onChange={e => setWorkingFilter(e.target.value)} optionType="button"
            options={[{ value: 'working', label: 'Đang làm' }, { value: 'left', label: 'Đã nghỉ' }, { value: 'all', label: 'Tất cả' }]} />
        </Space>

        <Card>
          <Table dataSource={list} columns={columns} rowKey="id" size="small" pagination={false} locale={{ emptyText: 'Không có nhân viên nào' }} />
        </Card>
      </div>
      <EmployeeFormModal
        open={employees.formOpen}
        id={employees.editingId}
        data={data}
        onClose={employees.closeAll}
        onSubmit={employees.submitEmployee}
        onDelete={employees.deleteEmployee}
      />
    </>
  );
}
