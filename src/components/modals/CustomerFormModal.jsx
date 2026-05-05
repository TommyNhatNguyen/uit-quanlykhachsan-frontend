import React, { useRef } from 'react';

export default function CustomerFormModal({ id, data, onClose, onSubmit }) {
  const formRef = useRef(null);
  const customer = id ? data.customers.find(c => c.id === id) : null;

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
          <h3 className="modal-title">{customer ? `Sửa khách hàng — ${customer.name}` : 'Thêm khách hàng'}</h3>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form ref={formRef}>
            <input type="hidden" name="id" defaultValue={customer?.id || ''} />
            <div className="form-grid">
              <div className="form-field full">
                <label>Họ và tên *</label>
                <input type="text" name="name" required defaultValue={customer?.name || ''} />
                <span className="err">Vui lòng nhập tên</span>
              </div>
              <div className="form-field">
                <label>Giới tính</label>
                <select name="sex" defaultValue={customer?.sex || 'Nam'}>
                  <option>Nam</option><option>Nữ</option><option>—</option>
                </select>
              </div>
              <div className="form-field">
                <label>Ngày sinh</label>
                <input type="date" name="dob" defaultValue={customer?.dob || ''} />
              </div>
              <div className="form-field">
                <label>Số điện thoại *</label>
                <input type="text" name="phone" required defaultValue={customer?.phone || ''} />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input type="email" name="email" defaultValue={customer?.email || ''} />
              </div>
              <div className="form-field full">
                <label>Ghi chú</label>
                <textarea name="notes" rows="2" defaultValue={customer?.notes || ''} />
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
