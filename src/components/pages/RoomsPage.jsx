import React, { useState } from 'react';
import { fmtVND, fmtDate } from '../../utils';

export default function RoomsPage({ data, persist, openModal, toast, navigateTo }) {
  const [tab, setTab] = useState('grid');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const counts = {
    all: data.rooms.length,
    available: data.rooms.filter(r => r.status === 'available').length,
    occupied: data.rooms.filter(r => r.status === 'occupied').length,
    maintenance: data.rooms.filter(r => r.status === 'maintenance').length,
  };

  let filtered = data.rooms;
  if (statusFilter !== 'all') filtered = filtered.filter(r => r.status === statusFilter);
  if (typeFilter !== 'all') filtered = filtered.filter(r => r.type === typeFilter);

  const roomLabel = (status) => status === 'available' ? 'Trống' : status === 'occupied' ? 'Đang ở' : 'Bảo trì';
  const roomCls = (status) => status === 'available' ? 'b-success' : status === 'occupied' ? 'b-warning' : 'b-danger';
  const roomColor = (status) => status === 'available' ? '#10b981' : status === 'occupied' ? '#f59e0b' : '#dc2626';

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý phòng</h1>
          <div className="page-sub">Tình trạng phòng hiện tại, đơn giá, và lịch sử biến động giá</div>
        </div>
        <div className="page-actions">
          <button className="btn" onClick={() => setTab('price')}>Lịch sử giá phòng</button>
          <button className="btn btn-primary" onClick={() => openModal('room-form')}>+ Thêm phòng</button>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab${tab === 'grid' ? ' active' : ''}`} onClick={() => setTab('grid')}>Lưới phòng</button>
        <button className={`tab${tab === 'list' ? ' active' : ''}`} onClick={() => setTab('list')}>Danh sách chi tiết</button>
        <button className={`tab${tab === 'price' ? ' active' : ''}`} onClick={() => setTab('price')}>Bảng giá</button>
      </div>

      {(tab === 'grid' || tab === 'list') && (
        <div className="filters">
          <div className="row">
            <span className="small muted">Trạng thái:</span>
            <button className={`chip${statusFilter === 'all' ? ' active' : ''}`} onClick={() => setStatusFilter('all')}>Tất cả · {counts.all}</button>
            <button className={`chip${statusFilter === 'available' ? ' active' : ''}`} onClick={() => setStatusFilter('available')}><span className="dot" style={{ background: '#10b981' }}></span> Trống · {counts.available}</button>
            <button className={`chip${statusFilter === 'occupied' ? ' active' : ''}`} onClick={() => setStatusFilter('occupied')}><span className="dot" style={{ background: '#f59e0b' }}></span> Đang ở · {counts.occupied}</button>
            <button className={`chip${statusFilter === 'maintenance' ? ' active' : ''}`} onClick={() => setStatusFilter('maintenance')}><span className="dot" style={{ background: '#dc2626' }}></span> Bảo trì · {counts.maintenance}</button>
          </div>
          <div style={{ flex: 1 }}></div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="all">Tất cả loại phòng</option>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
            <option value="Family">Family</option>
          </select>
        </div>
      )}

      {tab === 'grid' && (
        <div className="card">
          <div className="room-grid">
            {filtered.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Không có phòng nào</div>
            ) : filtered.map(r => (
              <div key={r.number} className={`room-tile ${r.status}`} onClick={() => openModal('room-form', { roomNumber: r.number })}>
                <div className="room-no">{r.number}</div>
                <div className="room-meta">{r.type} · {r.capacity}</div>
                <div className="room-meta">{fmtVND(r.price)}/đêm</div>
                <div className="room-status" style={{ color: roomColor(r.status) }}>
                  <span className="dot" style={{ background: roomColor(r.status) }}></span>
                  {roomLabel(r.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'list' && (
        <div className="card">
          <table>
            <thead>
              <tr><th>Số phòng</th><th>Loại</th><th>Sức chứa</th><th>Diện tích</th><th>Hút thuốc</th><th className="right">Giá/đêm</th><th>Trạng thái</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr className="empty-row"><td colSpan={8}>Không có phòng nào</td></tr>
              ) : filtered.map(r => (
                <tr key={r.number}>
                  <td className="strong">{r.number}</td>
                  <td>{r.type}</td>
                  <td>{r.capacity}</td>
                  <td>{r.area}</td>
                  <td>{r.smoking ? 'Có' : 'Không'}</td>
                  <td className="num right strong">{fmtVND(r.price)}</td>
                  <td><span className={`badge ${roomCls(r.status)}`}>{roomLabel(r.status)}</span></td>
                  <td><button className="btn btn-sm btn-ghost" onClick={() => openModal('room-form', { roomNumber: r.number })}>Sửa</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'price' && (
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">Lịch sử biến động giá (room_log_price)</h3>
            <button className="btn btn-sm btn-primary" onClick={() => openModal('price-form')}>+ Áp giá mới</button>
          </div>
          <table>
            <thead>
              <tr><th>ID</th><th>Phòng</th><th>Áp dụng từ</th><th>Áp dụng đến</th><th className="right">Giá/đêm</th></tr>
            </thead>
            <tbody>
              {data.priceLogs.length === 0 ? (
                <tr className="empty-row"><td colSpan={5}>Chưa có lịch sử giá</td></tr>
              ) : data.priceLogs.map(p => {
                const r = data.rooms.find(x => x.number === p.roomNumber);
                return (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td className="strong">{p.roomNumber} · {r ? r.type : '—'}</td>
                    <td>{fmtDate(p.from)}</td>
                    <td>{p.to ? fmtDate(p.to) : '—'}</td>
                    <td className="num right strong">{fmtVND(p.price)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
