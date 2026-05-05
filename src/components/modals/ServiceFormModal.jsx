import React, { useRef } from 'react';

export default function ServiceFormModal({ id, data, onClose, onSubmit, onDelete }) {
  const formRef = useRef(null);
  const service = id ? data.services.find(s => s.id === id) : null;

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
          <h3 className="modal-title">{service ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}</h3>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form ref={formRef}>
            <input type="hidden" name="id" defaultValue={service?.id || ''} />
            <div className="form-field" style={{ marginBottom: 12 }}>
              <label>Tên dịch vụ *</label>
              <input type="text" name="name" required defaultValue={service?.name || ''} />
            </div>
            <div className="form-field" style={{ marginBottom: 12 }}>
              <label>Danh mục *</label>
              <select name="catalog" required defaultValue={service?.catalog || 'Ăn uống'}>
                <option>Ăn uống</option>
                <option>Spa &amp; Wellness</option>
                <option>Giặt là</option>
                <option>Đưa đón</option>
                <option>Khác</option>
              </select>
            </div>
            <div className="form-field">
              <label>Đơn giá (₫) *</label>
              <input type="number" name="price" required min="0" step="1000" defaultValue={service?.price || ''} />
            </div>
          </form>
        </div>
        <div className="modal-foot">
          {service && <button className="btn btn-danger" style={{ marginRight: 'auto' }} onClick={() => onDelete(service.id)}>Xoá</button>}
          <button className="btn" onClick={onClose}>Huỷ</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Lưu</button>
        </div>
      </div>
    </div>
  );
}
