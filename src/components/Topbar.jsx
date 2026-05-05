import React, { useState, useEffect, useRef } from 'react';
import { fmtVND, fmtDate } from '../utils';

export default function Topbar({ data, persist, toast, navigateTo, openModal, onMarkAllRead }) {
  const [searchQ, setSearchQ] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  const hasUnread = data.notifications.some(n => n.unread);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const doSearch = (q) => {
    setSearchQ(q);
    setShowSearch(q.length >= 2);
  };

  const ql = searchQ.toLowerCase();
  const matchBookings = searchQ.length >= 2
    ? data.bookings.filter(b => b.id.toLowerCase().includes(ql) || b.customer.toLowerCase().includes(ql)).slice(0, 4)
    : [];
  const matchCustomers = searchQ.length >= 2
    ? data.customers.filter(c => c.name.toLowerCase().includes(ql) || c.phone.includes(ql) || (c.email || '').toLowerCase().includes(ql)).slice(0, 4)
    : [];
  const matchRooms = searchQ.length >= 2
    ? data.rooms.filter(r => r.number.includes(ql) || r.type.toLowerCase().includes(ql)).slice(0, 4)
    : [];

  const handleSearchResult = (type, id) => {
    setShowSearch(false);
    setSearchQ('');
    if (type === 'booking') { navigateTo('bookings'); openModal('booking-detail', { id }); }
    else if (type === 'customer') { navigateTo('customers'); openModal('customer-detail', { id: parseInt(id) }); }
    else if (type === 'room') { navigateTo('rooms'); openModal('room-form', { roomNumber: id }); }
  };

  const markNotifRead = (id) => {
    const newData = {
      ...data,
      notifications: data.notifications.map(n => n.id === id ? { ...n, unread: false } : n)
    };
    persist(newData);
  };

  const exportAll = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'hotel_admin_backup.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 500);
    toast('Đã xuất toàn bộ dữ liệu', 'success');
  };

  return (
    <div className="topbar">
      <div className="search" ref={searchRef}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Tìm kiếm booking, khách hàng, phòng…"
          autoComplete="off"
          value={searchQ}
          onChange={e => doSearch(e.target.value)}
          onFocus={() => { if (searchQ.length >= 2) setShowSearch(true); }}
        />
        {showSearch && (
          <div className="search-results show">
            {!matchBookings.length && !matchCustomers.length && !matchRooms.length ? (
              <div className="search-empty">Không tìm thấy kết quả cho "{searchQ}"</div>
            ) : (
              <>
                {matchBookings.length > 0 && (
                  <div className="search-group">
                    <div className="search-group-label">Booking</div>
                    {matchBookings.map(b => (
                      <div key={b.id} className="search-result" onClick={() => handleSearchResult('booking', b.id)}>
                        <div className="sr-icon">📅</div>
                        <div>
                          <div className="sr-title">#{b.id} · {b.customer}</div>
                          <div className="sr-sub">{fmtDate(b.checkin)} → {fmtDate(b.checkout)} · {fmtVND(b.amount)} ₫</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {matchCustomers.length > 0 && (
                  <div className="search-group">
                    <div className="search-group-label">Khách hàng</div>
                    {matchCustomers.map(c => (
                      <div key={c.id} className="search-result" onClick={() => handleSearchResult('customer', c.id)}>
                        <div className="sr-icon">👤</div>
                        <div>
                          <div className="sr-title">{c.name}</div>
                          <div className="sr-sub">{c.phone} · {c.tier} · {fmtVND(c.totalPaid)} ₫</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {matchRooms.length > 0 && (
                  <div className="search-group">
                    <div className="search-group-label">Phòng</div>
                    {matchRooms.map(r => (
                      <div key={r.number} className="search-result" onClick={() => handleSearchResult('room', r.number)}>
                        <div className="sr-icon">🏨</div>
                        <div>
                          <div className="sr-title">Phòng {r.number}</div>
                          <div className="sr-sub">{r.type} · {fmtVND(r.price)}/đêm · {r.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <div style={{ flex: 1 }}></div>
      <div className="actions">
        <div className="dropdown" ref={notifRef}>
          <button className="icon-btn" title="Thông báo" onClick={() => { setShowNotif(v => !v); setShowUser(false); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            {hasUnread && <span className="badge-dot"></span>}
          </button>
          {showNotif && (
            <div className="dropdown-menu show" style={{ width: 340, padding: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px 8px' }}>
                <strong style={{ fontSize: 13 }}>Thông báo</strong>
                <button className="btn btn-sm btn-ghost" onClick={() => { onMarkAllRead(); }}>Đánh dấu đã đọc</button>
              </div>
              <div className="notif-list">
                {data.notifications.map(n => (
                  <div
                    key={n.id}
                    className={`notif-item${n.unread ? ' unread' : ''}`}
                    onClick={() => markNotifRead(n.id)}
                  >
                    <div className="notif-icon">{n.icon}</div>
                    <div>
                      <div className="notif-title">{n.title}</div>
                      <div className="notif-sub">{n.sub} · {n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <button className="icon-btn" title="Cài đặt" onClick={() => toast('Trang cài đặt sẽ có trong phiên bản sau', 'info')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
        </button>
        <div className="dropdown" ref={userRef}>
          <div className="avatar" title="LuongCuong" onClick={() => { setShowUser(v => !v); setShowNotif(false); }}>LC</div>
          {showUser && (
            <div className="dropdown-menu show">
              <div className="dropdown-label">Tài khoản</div>
              <button className="dropdown-item"><span>👤</span> LuongCuong</button>
              <button className="dropdown-item"><span>✉️</span> cuongquocluong@gmail.com</button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={() => toast('Trang cài đặt sẽ có trong phiên bản sau', 'info')}><span>⚙️</span> Cài đặt hệ thống</button>
              <button className="dropdown-item" onClick={exportAll}><span>⬇️</span> Xuất toàn bộ dữ liệu</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
