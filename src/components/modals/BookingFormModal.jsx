import React, { useRef, useEffect } from 'react';
import { fmtVND } from '../../utils';
import { TODAY } from '../../constants';

export default function BookingFormModal({ id, data, onClose, onSubmit, prefillCustomerId }) {
  const formRef = useRef(null);
  const booking = id ? data.bookings.find(b => b.id === id) : null;

  useEffect(() => {
    if (prefillCustomerId && formRef.current) {
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.elements.customerId.value = String(prefillCustomerId);
        }
      }, 50);
    }
  }, [prefillCustomerId]);

  const handleSubmit = () => {
    const form = formRef.current;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const d = Object.fromEntries(new FormData(form));
    onSubmit(d);
  };

  const tomorrow = new Date(TODAY);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  return (
    <div className="modal-bg show">
      <div className="modal wide">
        <div className="modal-head">
          <h3 className="modal-title">{booking ? `Sửa booking #${booking.id}` : 'Tạo booking mới'}</h3>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form ref={formRef}>
            <input type="hidden" name="id" defaultValue={booking?.id || ''} />
            <div className="form-grid">
              <div className="form-field full">
                <label>Khách hàng *</label>
                <select name="customerId" required defaultValue={booking?.customerId || ''}>
                  <option value="">-- Chọn khách hàng --</option>
                  {data.customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} · {c.phone}</option>
                  ))}
                </select>
                <span className="err">Vui lòng chọn khách hàng</span>
              </div>
              <div className="form-field">
                <label>Check-in *</label>
                <input type="date" name="checkin" required defaultValue={booking?.checkin || TODAY} />
              </div>
              <div className="form-field">
                <label>Check-out *</label>
                <input type="date" name="checkout" required defaultValue={booking?.checkout || tomorrowStr} />
              </div>
              <div className="form-field">
                <label>Phòng *</label>
                <select name="room" required defaultValue={booking ? booking.rooms.split(',')[0].trim() : ''}>
                  <option value="">-- Chọn phòng --</option>
                  {data.rooms.filter(r => r.status !== 'maintenance').map(r => (
                    <option key={r.number} value={r.number}>Phòng {r.number} · {r.type} · {fmtVND(r.price)}/đêm</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Số lượng phòng</label>
                <input type="number" name="quantity" defaultValue={booking ? booking.rooms.split(',').length : 1} min="1" />
              </div>
              <div className="form-field full">
                <label>Ghi chú</label>
                <textarea name="notes" rows="2" placeholder="Yêu cầu đặc biệt..." defaultValue={booking?.notes || ''} />
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
