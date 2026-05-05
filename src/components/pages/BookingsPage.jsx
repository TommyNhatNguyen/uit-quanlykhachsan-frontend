import React, { useState, useEffect, useRef } from 'react';
import { fmtVND, fmtDate, toCSV, downloadCSV } from '../../utils';
import { statusMap, paymentMap, TODAY } from '../../constants';

function RowMenu({ booking, openModal, onChangeStatus, onCancel, onDelete }) {
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
          <button className="dropdown-item" onClick={() => { setOpen(false); openModal('booking-detail', { id: booking.id }); }}>👁  Xem chi tiết</button>
          <button className="dropdown-item" onClick={() => { setOpen(false); openModal('booking-form', { id: booking.id }); }}>✎  Sửa</button>
          {booking.status === 'pending' && <button className="dropdown-item" onClick={() => { setOpen(false); onChangeStatus(booking.id, 'confirmed'); }}>✓  Xác nhận</button>}
          {booking.status === 'confirmed' && <button className="dropdown-item" onClick={() => { setOpen(false); onChangeStatus(booking.id, 'checked_in'); }}>🔑  Check-in</button>}
          {booking.status === 'checked_in' && <button className="dropdown-item" onClick={() => { setOpen(false); onChangeStatus(booking.id, 'checked_out'); }}>🚪  Check-out</button>}
          {['pending', 'confirmed'].includes(booking.status) && (
            <>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item danger" onClick={() => { setOpen(false); onCancel(booking.id); }}>✕  Huỷ booking</button>
            </>
          )}
          <div className="dropdown-divider"></div>
          <button className="dropdown-item danger" onClick={() => { setOpen(false); onDelete(booking.id); }}>🗑  Xoá</button>
        </div>
      )}
    </div>
  );
}

export default function BookingsPage({ data, persist, openModal, toast, navigateTo, onChangeStatus, onCancel, onDelete }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [search, setSearch] = useState('');

  const counts = { all: data.bookings.length };
  Object.keys(statusMap).forEach(k => { counts[k] = data.bookings.filter(b => b.status === k).length; });

  let list = data.bookings;
  if (statusFilter !== 'all') list = list.filter(b => b.status === statusFilter);
  if (dateFilter) list = list.filter(b => b.checkin <= dateFilter && b.checkout >= dateFilter);
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
    toast('Đã xuất CSV', 'success');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý đặt phòng</h1>
          <div className="page-sub">Tất cả booking trong hệ thống — lọc, tìm kiếm, tạo mới và cập nhật trạng thái</div>
        </div>
        <div className="page-actions">
          <button className="btn" onClick={exportCSV}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Xuất CSV
          </button>
          <button className="btn btn-primary" onClick={() => openModal('booking-form')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Booking mới
          </button>
        </div>
      </div>

      <div className="filters">
        <div className="row" style={{ flexWrap: 'wrap' }}>
          <button className={`chip${statusFilter === 'all' ? ' active' : ''}`} onClick={() => setStatusFilter('all')}>
            Tất cả <span style={{ opacity: .6 }}>· {counts.all}</span>
          </button>
          {Object.entries(statusMap).map(([k, v]) => (
            <button key={k} className={`chip${statusFilter === k ? ' active' : ''}`} onClick={() => setStatusFilter(k)}>
              {v.label} <span style={{ opacity: .6 }}>· {counts[k] || 0}</span>
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }}></div>
        <input type="text" placeholder="Tìm mã, khách hàng…" style={{ width: 200 }} value={search} onChange={e => setSearch(e.target.value)} />
        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
        <button className="btn btn-sm btn-ghost" onClick={() => { setStatusFilter('all'); setDateFilter(''); setSearch(''); }}>Xoá lọc</button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Mã booking</th><th>Khách hàng</th><th>Check-in</th><th>Check-out</th>
              <th>Phòng</th><th>Trạng thái</th><th>Thanh toán</th><th className="right">Tổng tiền</th><th></th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr className="empty-row"><td colSpan={9}>Không có booking nào khớp bộ lọc</td></tr>
            ) : list.map(b => {
              const s = statusMap[b.status];
              const p = paymentMap[b.payment];
              return (
                <tr key={b.id}>
                  <td className="strong">#{b.id}</td>
                  <td>{b.customer}</td>
                  <td>{fmtDate(b.checkin)}</td>
                  <td>{fmtDate(b.checkout)}</td>
                  <td>{b.rooms}</td>
                  <td><span className={`badge ${s.cls}`}><span className="dot" style={{ background: s.dot }}></span>{s.label}</span></td>
                  <td><span className={`badge ${p.cls}`}>{p.label}</span></td>
                  <td className="num right strong">{fmtVND(b.amount)}</td>
                  <td>
                    <RowMenu
                      booking={b}
                      openModal={openModal}
                      onChangeStatus={onChangeStatus}
                      onCancel={onCancel}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
