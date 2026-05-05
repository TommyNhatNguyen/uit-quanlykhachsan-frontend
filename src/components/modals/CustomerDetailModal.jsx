import React from 'react';
import { fmtVND, fmtDate } from '../../utils';
import { statusMap, tierMap } from '../../constants';

export default function CustomerDetailModal({ customer, data, onClose, onEdit }) {
  if (!customer) return null;
  const bookings = data.bookings.filter(b => b.customerId === customer.id);
  const initials = customer.name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase();

  return (
    <div className="modal-bg show">
      <div className="modal wide">
        <div className="modal-head">
          <h3 className="modal-title">Hồ sơ khách hàng</h3>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 18 }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{customer.name}</div>
              <div className="small muted">{customer.phone} · {customer.email || '—'}</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span className={`badge ${tierMap[customer.tier]}`} style={{ fontSize: 12, padding: '4px 10px' }}>{customer.tier}</span>
            </div>
          </div>

          <div className="detail-grid" style={{ marginBottom: 18 }}>
            <div className="detail-row"><label>Tổng chi tiêu</label><div className="v">{fmtVND(customer.totalPaid)} ₫</div></div>
            <div className="detail-row"><label>Số lần đặt</label><div className="v">{bookings.length}</div></div>
            <div className="detail-row"><label>Giới tính</label><div className="v">{customer.sex}</div></div>
            <div className="detail-row"><label>Ngày sinh</label><div className="v">{fmtDate(customer.dob)}</div></div>
          </div>

          <h4 style={{ margin: '16px 0 8px', fontSize: 13 }}>Lịch sử booking ({bookings.length})</h4>
          <div className="card" style={{ marginBottom: 14 }}>
            <table>
              <thead>
                <tr><th>Mã</th><th>Check-in</th><th>Check-out</th><th>Trạng thái</th><th className="right">Tiền</th></tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr className="empty-row"><td colSpan={5}>Chưa có booking</td></tr>
                ) : bookings.map(b => (
                  <tr key={b.id}>
                    <td className="strong">#{b.id}</td>
                    <td>{fmtDate(b.checkin)}</td>
                    <td>{fmtDate(b.checkout)}</td>
                    <td><span className={`badge ${statusMap[b.status].cls}`}>{statusMap[b.status].label}</span></td>
                    <td className="num right">{fmtVND(b.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {customer.notes && (
            <div style={{ padding: 12, background: '#fafbfc', borderRadius: 8, fontSize: 13 }}>
              <strong>Ghi chú:</strong> {customer.notes}
            </div>
          )}
        </div>
        <div className="modal-foot">
          <button className="btn" onClick={onClose}>Đóng</button>
          <button className="btn btn-primary" onClick={() => { onClose(); onEdit(customer.id); }}>Sửa</button>
        </div>
      </div>
    </div>
  );
}
