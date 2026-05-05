import React from 'react';

const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
const titles = { success: 'Thành công', error: 'Có lỗi', warning: 'Chú ý', info: 'Thông báo' };

export default function Toast({ toasts, onRemove }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <div className="toast-icon">{icons[t.type] || 'ℹ'}</div>
          <div style={{ flex: 1 }}>
            <div className="toast-title">{titles[t.type] || 'Thông báo'}</div>
            <div className="toast-msg">{t.msg}</div>
          </div>
          <button className="toast-close" onClick={() => onRemove(t.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}
