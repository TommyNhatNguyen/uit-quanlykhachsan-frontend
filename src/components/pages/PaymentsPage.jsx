import React, { useState } from 'react';
import { fmtVND, fmtMoneyShort, fmtDateTime, toCSV, downloadCSV } from '../../utils';
import { TODAY } from '../../constants';

export default function PaymentsPage({ data, persist, openModal, toast, navigateTo }) {
  const [dateFilter, setDateFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [cashierFilter, setCashierFilter] = useState('all');

  const cashiers = [...new Set(data.employees.filter(e => e.position === 'Thu ngân').map(e => e.name))];

  let list = data.payments;
  if (dateFilter) list = list.filter(p => p.datetime.startsWith(dateFilter));
  if (methodFilter !== 'all') list = list.filter(p => p.method === methodFilter);
  if (cashierFilter !== 'all') list = list.filter(p => p.cashier === cashierFilter);

  const today = data.payments.filter(p => p.datetime.startsWith(TODAY) && p.amount > 0);
  const sum = today.reduce((s, p) => s + p.amount, 0);
  const byMethod = m => today.filter(p => p.method === m).reduce((s, p) => s + p.amount, 0);
  const cash = byMethod('Tiền mặt');
  const card = byMethod('Thẻ') + byMethod('QR');
  const bank = byMethod('Chuyển khoản');

  const exportCSV = () => {
    const csv = toCSV(data.payments, [
      { label: 'Mã GD', key: 'id' }, { label: 'Booking', key: 'bookingId' },
      { label: 'Khách', key: 'customer' }, { label: 'Phương thức', key: 'method' },
      { label: 'Thu ngân', key: 'cashier' }, { label: 'Thời gian', key: 'datetime' },
      { label: 'Số tiền', key: 'amount' }, { label: 'Trạng thái', key: 'status' },
    ]);
    downloadCSV(`payments_${TODAY}.csv`, csv);
    toast('Đã xuất CSV', 'success');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Thanh toán</h1>
          <div className="page-sub">Lịch sử giao dịch, phương thức và thu ngân</div>
        </div>
        <div className="page-actions">
          <button className="btn" onClick={exportCSV}>Xuất CSV</button>
          <button className="btn btn-primary" onClick={() => openModal('payment-form')}>+ Ghi nhận thanh toán</button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-head">Thu hôm nay</div>
          <div className="kpi-val">{fmtMoneyShort(sum)}</div>
          <div className="small kpi-up">▲ 8.4%</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-head">Tiền mặt</div>
          <div className="kpi-val">{fmtMoneyShort(cash)}</div>
          <div className="small muted">{sum ? ((cash / sum) * 100).toFixed(1) + '%' : '0%'}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-head">Thẻ / QR</div>
          <div className="kpi-val">{fmtMoneyShort(card)}</div>
          <div className="small muted">{sum ? ((card / sum) * 100).toFixed(1) + '%' : '0%'}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-head">Chuyển khoản</div>
          <div className="kpi-val">{fmtMoneyShort(bank)}</div>
          <div className="small muted">{sum ? ((bank / sum) * 100).toFixed(1) + '%' : '0%'}</div>
        </div>
      </div>

      <div className="filters">
        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
        <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
          <option value="all">Tất cả phương thức</option>
          <option value="Tiền mặt">Tiền mặt</option>
          <option value="Thẻ">Thẻ</option>
          <option value="QR">QR</option>
          <option value="Chuyển khoản">Chuyển khoản</option>
        </select>
        <select value={cashierFilter} onChange={e => setCashierFilter(e.target.value)}>
          <option value="all">Tất cả thu ngân</option>
          {cashiers.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="btn btn-sm btn-ghost" onClick={() => { setDateFilter(''); setMethodFilter('all'); setCashierFilter('all'); }}>Xoá lọc</button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr><th>Mã GD</th><th>Booking</th><th>Khách hàng</th><th>Phương thức</th><th>Thu ngân</th><th>Thời gian</th><th className="right">Số tiền</th><th>Trạng thái</th></tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr className="empty-row"><td colSpan={8}>Không có giao dịch nào</td></tr>
            ) : list.map(p => (
              <tr key={p.id}>
                <td className="strong">{p.id}</td>
                <td>#{p.bookingId}</td>
                <td>{p.customer}</td>
                <td><span className="badge">{p.method}</span></td>
                <td>{p.cashier}</td>
                <td className="muted">{fmtDateTime(p.datetime)}</td>
                <td className="num right strong" style={p.amount < 0 ? { color: 'var(--danger)' } : {}}>
                  {fmtVND(p.amount)}
                </td>
                <td>
                  {p.status === 'refund'
                    ? <span className="badge b-danger">Hoàn tiền</span>
                    : <span className="badge b-success">Thành công</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
