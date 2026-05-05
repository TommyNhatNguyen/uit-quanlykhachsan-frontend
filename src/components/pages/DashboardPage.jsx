import React, { useRef, useEffect, useState } from 'react';
import { fmtVND, fmtDate, fmtMoneyShort } from '../../utils';
import { statusMap, tierMap, TODAY } from '../../constants';

const chartColors = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2'];

export function revenueSeries(days) {
  const out = [];
  const base = [24, 28, 32, 30, 38, 46, 48, 42, 35, 31];
  for (let i = 0; i < days; i++) {
    const room = base[i % base.length] + (i % 3);
    const service = Math.round(room * 0.33);
    out.push({ room, service });
  }
  return out;
}

export default function DashboardPage({ data, persist, openModal, toast, navigateTo }) {
  const [period, setPeriod] = useState(7);
  const revenueRef = useRef(null);
  const roomTypeRef = useRef(null);
  const revenueChart = useRef(null);
  const roomTypeChart = useRef(null);

  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');

  const todayBookings = data.bookings.filter(b => b.checkin === TODAY && b.status !== 'cancelled').length;
  const todayRevenue = data.payments.filter(p => p.datetime.startsWith(TODAY) && p.amount > 0).reduce((s, p) => s + p.amount, 0);
  const occ = data.rooms.filter(r => r.status === 'occupied').length;
  const total = data.rooms.length;
  const occupancy = total ? Math.round((occ / total) * 100) : 0;

  const series = revenueSeries(period);
  const totalRev = series.reduce((s, v) => s + v.room + v.service, 0);

  useEffect(() => {
    if (!revenueRef.current || !window.Chart) return;
    if (revenueChart.current) revenueChart.current.destroy();
    const labels = period === 7 ? ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] : series.map((_, i) => `${i + 1}`);
    revenueChart.current = new window.Chart(revenueRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Phòng', data: series.map(s => s.room), borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,.08)', fill: true, tension: .35, borderWidth: 2, pointRadius: period <= 14 ? 3 : 0 },
          { label: 'Dịch vụ', data: series.map(s => s.service), borderColor: '#7c3aed', backgroundColor: 'rgba(124,58,237,.06)', fill: true, tension: .35, borderWidth: 2, pointRadius: period <= 14 ? 3 : 0 },
        ]
      },
      options: {
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, padding: 16 } } },
        scales: { y: { beginAtZero: true, ticks: { callback: v => v + 'M' }, grid: { color: '#f2f4f7' } }, x: { grid: { display: false } } }
      }
    });
    return () => { revenueChart.current?.destroy(); };
  }, [period]);

  useEffect(() => {
    if (!roomTypeRef.current || !window.Chart) return;
    if (roomTypeChart.current) roomTypeChart.current.destroy();
    const typeCounts = ['Standard', 'Deluxe', 'Suite', 'Family'].map(t => data.rooms.filter(r => r.type === t).length);
    roomTypeChart.current = new window.Chart(roomTypeRef.current, {
      type: 'doughnut',
      data: { labels: ['Standard', 'Deluxe', 'Suite', 'Family'], datasets: [{ data: typeCounts, backgroundColor: chartColors, borderWidth: 0 }] },
      options: { maintainAspectRatio: false, cutout: '62%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, padding: 14 } } } }
    });
    return () => { roomTypeChart.current?.destroy(); };
  }, [data.rooms]);

  const recent = [...data.bookings].slice(0, 5);
  const topCustomers = [...data.customers].sort((a, b) => b.totalPaid - a.totalPaid).slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <div className="page-sub">Tổng quan hoạt động — cập nhật lúc {hh}:{mm}, 23/04/2026</div>
        </div>
        <div className="page-actions">
          <button className="btn" onClick={() => toast('Đã làm mới dashboard', 'success')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
            Làm mới
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-head">📅 Booking hôm nay</div>
          <div className="kpi-val">{todayBookings}</div>
          <div className="kpi-change kpi-up">▲ Có {todayBookings} booking nhận phòng hôm nay</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-head">💰 Doanh thu hôm nay</div>
          <div className="kpi-val">{fmtMoneyShort(todayRevenue)} <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>₫</span></div>
          <div className="kpi-change kpi-up">▲ 8.4% WoW</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-head">🏨 Tỷ lệ lấp đầy</div>
          <div className="kpi-val">{occupancy}%</div>
          <div className={`kpi-change ${occupancy >= 70 ? 'kpi-up' : 'kpi-down'}`}>{occupancy >= 70 ? '▲' : '▼'} {occupancy}% phòng đang có khách</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-head">👥 Khách hàng</div>
          <div className="kpi-val">{data.customers.length}</div>
          <div className="kpi-change kpi-up">▲ Tổng khách trong hệ thống</div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">Doanh thu {period} ngày qua</h3>
              <div className="small muted" style={{ marginTop: 2 }}>Tổng: <strong style={{ color: 'var(--text)' }}>{fmtMoneyShort(totalRev * 1e6)} ₫</strong></div>
            </div>
            <div className="row">
              {[7, 30, 90].map(p => (
                <button key={p} className={`chip${period === p ? ' active' : ''}`} onClick={() => setPeriod(p)}>{p} ngày</button>
              ))}
            </div>
          </div>
          <div className="card-body" style={{ padding: '16px 18px', height: 300 }}>
            <canvas ref={revenueRef} />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3 className="card-title">Phân bố loại phòng</h3>
          </div>
          <div className="card-body" style={{ padding: '16px 18px', height: 300 }}>
            <canvas ref={roomTypeRef} />
          </div>
        </div>
      </div>

      <div className="two-col" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">Booking gần đây</h3>
            <button className="btn btn-sm btn-ghost" onClick={() => navigateTo('bookings')}>Xem tất cả →</button>
          </div>
          <table>
            <thead>
              <tr><th>Mã</th><th>Khách</th><th>Phòng</th><th>Trạng thái</th><th className="right">Tiền</th></tr>
            </thead>
            <tbody>
              {recent.map(b => {
                const s = statusMap[b.status];
                return (
                  <tr key={b.id} style={{ cursor: 'pointer' }} onClick={() => openModal('booking-detail', { id: b.id })}>
                    <td className="strong">#{b.id}</td>
                    <td>{b.customer}</td>
                    <td>{b.rooms}</td>
                    <td><span className={`badge ${s.cls}`}><span className="dot" style={{ background: s.dot }}></span>{s.label}</span></td>
                    <td className="num right">{fmtVND(b.amount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-head">
            <h3 className="card-title">Top khách hàng theo chi tiêu</h3>
            <button className="btn btn-sm btn-ghost" onClick={() => navigateTo('customers')}>Xem tất cả →</button>
          </div>
          <table>
            <thead>
              <tr><th>Khách hàng</th><th>Hạng</th><th className="right">Chi tiêu</th></tr>
            </thead>
            <tbody>
              {topCustomers.map(c => (
                <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => openModal('customer-detail', { id: c.id })}>
                  <td className="strong">{c.name}</td>
                  <td><span className={`badge ${tierMap[c.tier]}`}>{c.tier}</span></td>
                  <td className="num right strong">{fmtMoneyShort(c.totalPaid)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
