import React from 'react';

export default function ConfirmModal({ message, title = 'Xác nhận', okLabel = 'Xác nhận', danger = true, onOk, onClose }) {
  return (
    <div className="modal-bg show">
      <div className="modal narrow">
        <div className="modal-head">
          <h3 className="modal-title">{title}</h3>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" dangerouslySetInnerHTML={{ __html: message }} />
        <div className="modal-foot">
          <button className="btn" onClick={onClose}>Huỷ</button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={() => { onOk(); onClose(); }}>
            {okLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
