import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ data, onReset }) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeBookings = data.bookings.filter(b => !['cancelled', 'checked_out'].includes(b.status)).length;

  const isActive = (path) => location.pathname === path;
  const go = (path) => navigate(path);

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">H</div>
        <div>
          <div className="brand-text">HotelBooking</div>
          <div className="brand-sub">Admin Console</div>
        </div>
      </div>

      <div className="nav-section-label">Tổng quan</div>
      <button className={`nav-item${isActive('/') ? ' active' : ''}`} onClick={() => go('/')}>
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="7" height="9" rx="1"/>
          <rect x="14" y="3" width="7" height="5" rx="1"/>
          <rect x="14" y="12" width="7" height="9" rx="1"/>
          <rect x="3" y="16" width="7" height="5" rx="1"/>
        </svg>
        <span>Dashboard</span>
      </button>

      <div className="nav-section-label">Vận hành</div>
      <button className={`nav-item${isActive('/bookings') ? ' active' : ''}`} onClick={() => go('/bookings')}>
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span>Đặt phòng</span>
        <span className="count">{activeBookings}</span>
      </button>
      <button className={`nav-item${isActive('/rooms') ? ' active' : ''}`} onClick={() => go('/rooms')}>
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 9l9-6 9 6v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span>Phòng</span>
        <span className="count">{data.rooms.length}</span>
      </button>
      <button className={`nav-item${isActive('/customers') ? ' active' : ''}`} onClick={() => go('/customers')}>
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87"/>
          <path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
        <span>Khách hàng</span>
        <span className="count">{data.customers.length}</span>
      </button>
      <button className={`nav-item${isActive('/services') ? ' active' : ''}`} onClick={() => go('/services')}>
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/>
        </svg>
        <span>Dịch vụ</span>
        <span className="count">{data.services.length}</span>
      </button>

      <div className="nav-section-label">Tài chính</div>
      <button className={`nav-item${isActive('/payments') ? ' active' : ''}`} onClick={() => go('/payments')}>
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="2" y="5" width="20" height="14" rx="2"/>
          <line x1="2" y1="10" x2="22" y2="10"/>
        </svg>
        <span>Thanh toán</span>
      </button>
      <button className={`nav-item${isActive('/reports') ? ' active' : ''}`} onClick={() => go('/reports')}>
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 3v18h18"/>
          <path d="M7 14l4-4 4 4 5-5"/>
        </svg>
        <span>Báo cáo</span>
      </button>

      <div className="nav-section-label">Hệ thống</div>
      <button className={`nav-item${isActive('/employees') ? ' active' : ''}`} onClick={() => go('/employees')}>
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 11h-6M22 15h-6"/>
        </svg>
        <span>Nhân viên</span>
      </button>
      <button className={`nav-item${isActive('/integration') ? ' active' : ''}`} onClick={() => go('/integration')}>
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
        <span>Kết nối DB</span>
      </button>

      <div style={{ flex: 1 }}></div>
      <button className="nav-item" onClick={onReset} title="Khôi phục dữ liệu mẫu">
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="23 4 23 10 17 10"/>
          <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
        </svg>
        <span>Reset dữ liệu</span>
      </button>
    </aside>
  );
}
