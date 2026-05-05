import React, { useState } from 'react';
import { fmtVND } from '../../utils';

const CATS = ['all', 'Ăn uống', 'Spa & Wellness', 'Giặt là', 'Đưa đón', 'Khác'];

export default function ServicesPage({ data, persist, openModal, toast, navigateTo }) {
  const [catFilter, setCatFilter] = useState('all');

  let list = data.services;
  if (catFilter !== 'all') list = list.filter(s => s.catalog === catFilter);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dịch vụ bổ sung</h1>
          <div className="page-sub">Các dịch vụ khách có thể đặt thêm (spa, ăn uống, giặt là, đưa đón…)</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => openModal('service-form')}>+ Thêm dịch vụ</button>
        </div>
      </div>

      <div className="filters">
        <div className="row">
          {CATS.map(c => (
            <button key={c} className={`chip${catFilter === c ? ' active' : ''}`} onClick={() => setCatFilter(c)}>
              {c === 'all' ? 'Tất cả' : c}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr><th>ID</th><th>Tên dịch vụ</th><th>Danh mục</th><th className="right">Đơn giá</th><th className="right">Lượt dùng (30d)</th><th></th></tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr className="empty-row"><td colSpan={6}>Không có dịch vụ nào</td></tr>
            ) : list.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td className="strong">{s.name}</td>
                <td><span className="badge">{s.catalog}</span></td>
                <td className="num right strong">{fmtVND(s.price)}</td>
                <td className="num right">{s.used}</td>
                <td><button className="btn btn-sm btn-ghost" onClick={() => openModal('service-form', { id: s.id })}>Sửa</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
