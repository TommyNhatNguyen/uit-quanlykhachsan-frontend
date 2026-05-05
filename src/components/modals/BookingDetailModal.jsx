import React from 'react';
import { fmtVND, fmtDate } from '../../utils';
import { statusMap, paymentMap } from '../../constants';

export default function BookingDetailModal({ booking, onClose, onEdit, onChangeStatus }) {
  if (!booking) return null;
  const s = statusMap[booking.status];
  const p = paymentMap[booking.payment];
  const nights = Math.max(1, Math.round((new Date(booking.checkout) - new Date(booking.checkin)) / 86400000));

  return (
    <div className="modal-bg show">
      <div className="modal wide">
        <div className="modal-head">
          <h3 className="modal-title">Chi tiết booking</h3>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>#{booking.id}</div>
            <span className={`badge ${s.cls}`}><span className="dot" style={{ background: s.dot }}></span>{s.label}</span>
            <span className={`badge ${p.cls}`}>{p.label}</span>
          </div>
          <div className="detail-grid">
            <div className="detail-row"><label>Khách hàng</label><div className="v">{booking.customer}</div></div>
            <div className="detail-row"><label>Phòng</label><div className="v">{booking.rooms}</div></div>
            <div className="detail-row"><label>Check-in</label><div className="v">{fmtDate(booking.checkin)}</div></div>
            <div className="detail-row"><label>Check-out</label><div className="v">{fmtDate(booking.checkout)}</div></div>
            <div className="detail-row"><label>Tổng tiền</label><div className="v">{fmtVND(booking.amount)} ₫</div></div>
            <div className="detail-row"><label>Số đêm</label><div className="v">{nights}</div></div>
          </div>
          {booking.notes && (
            <div style={{ marginTop: 14, padding: 12, background: '#fafbfc', borderRadius: 8, fontSize: 13 }}>
              <strong>Ghi chú:</strong> {booking.notes}
            </div>
          )}
        </div>
        <div className="modal-foot">
          <button className="btn" onClick={onClose}>Đóng</button>
          {booking.status === 'pending' && <button className="btn btn-primary" onClick={() => { onChangeStatus(booking.id, 'confirmed'); onClose(); }}>Xác nhận</button>}
          {booking.status === 'confirmed' && <button className="btn btn-primary" onClick={() => { onChangeStatus(booking.id, 'checked_in'); onClose(); }}>Check-in</button>}
          {booking.status === 'checked_in' && <button className="btn btn-primary" onClick={() => { onChangeStatus(booking.id, 'checked_out'); onClose(); }}>Check-out</button>}
          <button className="btn" onClick={() => { onClose(); onEdit(booking.id); }}>Sửa</button>
        </div>
      </div>
    </div>
  );
}
