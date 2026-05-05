import React, { useState } from 'react';
import { fmtDate } from '../../utils';

export default function EmployeesPage({ data, persist, openModal, toast, navigateTo }) {
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

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Nhân viên</h1>
          <div className="page-sub">Danh sách nhân sự, vị trí và trạng thái làm việc</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => openModal('employee-form')}>+ Thêm nhân viên</button>
        </div>
      </div>

      <div className="filters">
        <input type="text" placeholder="Tìm theo tên, SĐT…" style={{ maxWidth: 280 }} value={search} onChange={e => setSearch(e.target.value)} />
        <select value={positionFilter} onChange={e => setPositionFilter(e.target.value)}>
          <option value="all">Tất cả vị trí</option>
          <option value="Lễ tân">Lễ tân</option>
          <option value="Thu ngân">Thu ngân</option>
          <option value="Buồng phòng">Buồng phòng</option>
          <option value="Quản lý">Quản lý</option>
        </select>
        <select value={workingFilter} onChange={e => setWorkingFilter(e.target.value)}>
          <option value="working">Đang làm việc</option>
          <option value="left">Đã nghỉ</option>
          <option value="all">Tất cả</option>
        </select>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr><th>Mã NV</th><th>Họ tên</th><th>Ngày sinh</th><th>SĐT</th><th>Vị trí</th><th>Bắt đầu</th><th>Trạng thái</th><th></th></tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr className="empty-row"><td colSpan={8}>Không có nhân viên nào</td></tr>
            ) : list.map(e => (
              <tr key={e.id}>
                <td className="strong">{e.id}</td>
                <td>{e.name}</td>
                <td>{fmtDate(e.dob)}</td>
                <td>{e.phone}</td>
                <td><span className="badge">{e.position}</span></td>
                <td>{fmtDate(e.start)}</td>
                <td>{e.working ? <span className="badge b-success">Đang làm</span> : <span className="badge">Đã nghỉ</span>}</td>
                <td><button className="btn btn-sm btn-ghost" onClick={() => openModal('employee-form', { id: e.id })}>Hồ sơ</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
