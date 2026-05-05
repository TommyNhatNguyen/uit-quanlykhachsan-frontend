import React, { useRef } from 'react';
import { fmtVND } from '../../utils';

export default function PaymentFormModal({ data, onClose, onSubmit }) {
  const formRef = useRef(null);
  const now = new Date().toISOString().slice(0, 16);
  const cashiers = data.employees.filter(e => e.position === 'Thu ngân' && e.working);
  const unpaidBookings = data.bookings.filter(b => b.payment !== 'paid' && b.status !== 'cancelled');

  const handleSubmit = () => {
    const form = formRef.current;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const d = Object.fromEntries(new FormData(form));
    onSubmit(d);
  };

  return (
    <div className="modal-bg show">
      <div className="modal">
        <div className="modal-head">
          <h3 className="modal-title">Ghi nhận thanh toán</h3>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form ref={formRef}>
            <div className="form-grid">
              <div className="form-field full">
                <label>Booking *</label>
                <select name="bookingId" required>
                  {unpaidBookings.length === 0
                    ? <option value="">Không có booking chưa thanh toán</option>
                    : unpaidBookings.map(b => (
                      <option key={b.id} value={b.id}>#{b.id} · {b.customer} · {fmtVND(b.amount)}</option>
                    ))
                  }
                </select>
              </div>
              <div className="form-field">
                <label>Số tiền (₫) *</label>
                <input type="number" name="amount" required min="0" step="1000" />
              </div>
              <div className="form-field">
                <label>Phương thức *</label>
                <select name="method" required>
                  <option>Tiền mặt</option>
                  <option>Thẻ</option>
                  <option>QR</option>
                  <option>Chuyển khoản</option>
                </select>
              </div>
              <div className="form-field">
                <label>Thu ngân *</label>
                <select name="cashier" required>
                  {cashiers.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Thời gian</label>
                <input type="datetime-local" name="datetime" defaultValue={now} />
              </div>
            </div>
          </form>
        </div>
        <div className="modal-foot">
          <button className="btn" onClick={onClose}>Huỷ</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Lưu</button>
        </div>
      </div>
    </div>
  );
}
