import React, { useRef } from 'react';
import { TODAY } from '../../constants';

export default function PriceFormModal({ data, onClose, onSubmit }) {
  const formRef = useRef(null);

  const handleSubmit = () => {
    const form = formRef.current;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const d = Object.fromEntries(new FormData(form));
    onSubmit(d);
  };

  return (
    <div className="modal-bg show">
      <div className="modal narrow">
        <div className="modal-head">
          <h3 className="modal-title">Áp giá mới</h3>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form ref={formRef}>
            <div className="form-field" style={{ marginBottom: 12 }}>
              <label>Phòng *</label>
              <select name="roomNumber" required>
                {data.rooms.map(r => (
                  <option key={r.number} value={r.number}>{r.number} · {r.type}</option>
                ))}
              </select>
            </div>
            <div className="form-field" style={{ marginBottom: 12 }}>
              <label>Áp dụng từ *</label>
              <input type="date" name="from" required defaultValue={TODAY} />
            </div>
            <div className="form-field" style={{ marginBottom: 12 }}>
              <label>Áp dụng đến (để trống = không giới hạn)</label>
              <input type="date" name="to" />
            </div>
            <div className="form-field">
              <label>Giá/đêm (₫) *</label>
              <input type="number" name="price" required min="0" step="10000" />
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
