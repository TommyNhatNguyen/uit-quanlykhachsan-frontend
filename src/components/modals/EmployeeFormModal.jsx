import React, { useRef } from 'react';
import { TODAY } from '../../constants';

export default function EmployeeFormModal({ id, data, onClose, onSubmit, onDelete }) {
  const formRef = useRef(null);
  const employee = id ? data.employees.find(e => e.id === id) : null;

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
          <h3 className="modal-title">{employee ? `Hồ sơ — ${employee.name}` : 'Thêm nhân viên'}</h3>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form ref={formRef}>
            <input type="hidden" name="id" defaultValue={employee?.id || ''} />
            <div className="form-grid">
              <div className="form-field full">
                <label>Họ và tên *</label>
                <input type="text" name="name" required defaultValue={employee?.name || ''} />
              </div>
              <div className="form-field">
                <label>Ngày sinh</label>
                <input type="date" name="dob" defaultValue={employee?.dob || ''} />
              </div>
              <div className="form-field">
                <label>Số điện thoại *</label>
                <input type="text" name="phone" required defaultValue={employee?.phone || ''} />
              </div>
              <div className="form-field">
                <label>Vị trí *</label>
                <select name="position" required defaultValue={employee?.position || 'Lễ tân'}>
                  <option>Lễ tân</option>
                  <option>Thu ngân</option>
                  <option>Buồng phòng</option>
                  <option>Quản lý</option>
                  <option>Bảo vệ</option>
                </select>
              </div>
              <div className="form-field">
                <label>Ngày bắt đầu</label>
                <input type="date" name="start" defaultValue={employee?.start || TODAY} />
              </div>
              <div className="form-field full">
                <label>Trạng thái</label>
                <select name="working" defaultValue={employee ? String(employee.working) : 'true'}>
                  <option value="true">Đang làm việc</option>
                  <option value="false">Đã nghỉ</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        <div className="modal-foot">
          {employee && <button className="btn btn-danger" style={{ marginRight: 'auto' }} onClick={() => onDelete(employee.id)}>Xoá</button>}
          <button className="btn" onClick={onClose}>Huỷ</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Lưu</button>
        </div>
      </div>
    </div>
  );
}
