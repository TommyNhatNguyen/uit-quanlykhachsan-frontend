import React, { useState, useEffect, useRef } from 'react';
import { fmtVND, fmtDate, toCSV, downloadCSV } from '../../utils';
import { tierMap, TODAY } from '../../constants';

function RowMenu({ customer, openModal, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="dropdown" ref={ref}>
      <button className="btn btn-sm btn-ghost" onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}>⋯</button>
      {open && (
        <div className="dropdown-menu show" style={{ right: 0 }}>
          <button className="dropdown-item" onClick={() => { setOpen(false); openModal('customer-detail', { id: customer.id }); }}>👁  Hồ sơ</button>
          <button className="dropdown-item" onClick={() => { setOpen(false); openModal('customer-form', { id: customer.id }); }}>✎  Sửa</button>
          <button className="dropdown-item" onClick={() => { setOpen(false); openModal('booking-form', { customerId: customer.id }); }}>📅  Tạo booking</button>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item danger" onClick={() => { setOpen(false); onDelete(customer.id); }}>🗑  Xoá</button>
        </div>
      )}
    </div>
  );
}

export default function CustomersPage({ data, persist, openModal, toast, navigateTo, onDelete }) {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [sort, setSort] = useState('new');

  let list = [...data.customers];
  if (tierFilter !== 'all') list = list.filter(c => c.tier === tierFilter);
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.email || '').toLowerCase().includes(q));
  }
  if (sort === 'new') list.sort((a, b) => b.id - a.id);
  else if (sort === 'old') list.sort((a, b) => a.id - b.id);
  else if (sort === 'top') list.sort((a, b) => b.totalPaid - a.totalPaid);

  const exportCSV = () => {
    const csv = toCSV(data.customers, [
      { label: 'Họ tên', key: 'name' }, { label: 'Giới tính', key: 'sex' },
      { label: 'SĐT', key: 'phone' }, { label: 'Email', key: 'email' },
      { label: 'Ngày sinh', key: 'dob' }, { label: 'Hạng', key: 'tier' },
      { label: 'Tổng chi tiêu', key: 'totalPaid' },
    ]);
    downloadCSV(`customers_${TODAY}.csv`, csv);
    toast('Đã xuất CSV', 'success');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Khách hàng</h1>
          <div className="page-sub">Danh sách khách hàng, hạng thành viên và lịch sử giao dịch</div>
        </div>
        <div className="page-actions">
          <button className="btn" onClick={exportCSV}>Xuất CSV</button>
          <button className="btn btn-primary" onClick={() => openModal('customer-form')}>+ Thêm khách hàng</button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-head">Tổng khách hàng</div>
          <div className="kpi-val">{data.customers.length}</div>
          <div className="small muted">Trong toàn hệ thống</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-head">Diamond</div>
          <div className="kpi-val">{data.customers.filter(c => c.tier === 'Diamond').length}</div>
          <div className="small muted">Chi tiêu ≥ 50M</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-head">Gold</div>
          <div className="kpi-val">{data.customers.filter(c => c.tier === 'Gold').length}</div>
          <div className="small muted">20–50M</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-head">Silver</div>
          <div className="kpi-val">{data.customers.filter(c => c.tier === 'Silver').length}</div>
          <div className="small muted">&lt; 20M</div>
        </div>
      </div>

      <div className="filters">
        <input type="text" placeholder="Tìm theo tên, SĐT, email…" style={{ flex: 1, maxWidth: 320 }} value={search} onChange={e => setSearch(e.target.value)} />
        <select value={tierFilter} onChange={e => setTierFilter(e.target.value)}>
          <option value="all">Tất cả hạng</option>
          <option value="Diamond">Diamond</option>
          <option value="Gold">Gold</option>
          <option value="Silver">Silver</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="new">Mới → Cũ</option>
          <option value="old">Cũ → Mới</option>
          <option value="top">Chi tiêu cao nhất</option>
        </select>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr><th>Khách hàng</th><th>Giới tính</th><th>SĐT</th><th>Email</th><th>Ngày sinh</th><th>Hạng</th><th className="right">Tổng chi tiêu</th><th></th></tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr className="empty-row"><td colSpan={8}>Không có khách hàng nào</td></tr>
            ) : list.map(c => (
              <tr key={c.id}>
                <td className="strong">{c.name}</td>
                <td>{c.sex}</td>
                <td>{c.phone}</td>
                <td className="muted">{c.email || '—'}</td>
                <td>{fmtDate(c.dob)}</td>
                <td><span className={`badge ${tierMap[c.tier]}`}>{c.tier}</span></td>
                <td className="num right strong">{fmtVND(c.totalPaid)}</td>
                <td>
                  <RowMenu customer={c} openModal={openModal} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
