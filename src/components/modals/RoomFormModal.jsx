import React, { useRef } from 'react';

export default function RoomFormModal({ roomNumber, data, onClose, onSubmit, onDelete }) {
  const formRef = useRef(null);
  const room = roomNumber ? data.rooms.find(r => r.number === roomNumber) : null;

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
          <h3 className="modal-title">{room ? `Sửa phòng ${roomNumber}` : 'Thêm phòng'}</h3>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form ref={formRef}>
            <input type="hidden" name="number_old" defaultValue={room?.number || ''} />
            <div className="form-grid">
              <div className="form-field">
                <label>Số phòng *</label>
                <input type="text" name="number" required placeholder="VD: 301" defaultValue={room?.number || ''} />
              </div>
              <div className="form-field">
                <label>Loại phòng *</label>
                <select name="type" required defaultValue={room?.type || 'Standard'}>
                  <option>Standard</option><option>Deluxe</option><option>Suite</option><option>Family</option>
                </select>
              </div>
              <div className="form-field">
                <label>Giá/đêm (₫) *</label>
                <input type="number" name="price" required min="0" step="10000" defaultValue={room?.price || ''} />
              </div>
              <div className="form-field">
                <label>Sức chứa</label>
                <select name="capacity" defaultValue={room?.capacity || '2 khách'}>
                  <option>1 khách</option><option>2 khách</option><option>3 khách</option><option>4 khách</option><option>5 khách</option>
                </select>
              </div>
              <div className="form-field">
                <label>Diện tích</label>
                <input type="text" name="area" placeholder="VD: 32m²" defaultValue={room?.area || ''} />
              </div>
              <div className="form-field">
                <label>Hút thuốc</label>
                <select name="smoking" defaultValue={room ? String(room.smoking) : 'false'}>
                  <option value="false">Không</option>
                  <option value="true">Có</option>
                </select>
              </div>
              <div className="form-field full">
                <label>Trạng thái</label>
                <select name="status" defaultValue={room?.status || 'available'}>
                  <option value="available">Trống</option>
                  <option value="occupied">Đang ở</option>
                  <option value="maintenance">Bảo trì</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        <div className="modal-foot">
          {room && <button className="btn btn-danger" style={{ marginRight: 'auto' }} onClick={() => onDelete(room.number)}>Xoá phòng</button>}
          <button className="btn" onClick={onClose}>Huỷ</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Lưu</button>
        </div>
      </div>
    </div>
  );
}
