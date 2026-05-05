import React, { useRef, useEffect, useState } from 'react';
import { fmtMoneyShort } from '../../utils';
import { revenueSeries } from './DashboardPage';

const chartColors = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2'];

export default function ReportsPage({ data, persist, openModal, toast, navigateTo }) {
  const [period, setPeriod] = useState('4/2026');
  const revRef = useRef(null);
  const breakRef = useRef(null);
  const occRef = useRef(null);
  const revChart = useRef(null);
  const breakChart = useRef(null);
  const occChart = useRef(null);

  useEffect(() => {
    if (!revRef.current || !window.Chart) return;
    if (revChart.current) revChart.current.destroy();
    const daysR = period === 'q1/2026' ? 90 : 23;
    const dataR = revenueSeries(daysR).map(s => s.room + s.service);
    revChart.current = new window.Chart(revRef.current, {
      type: 'bar',
      data: { labels: dataR.map((_, i) => `${i + 1}`), datasets: [{ label: 'Doanh thu (triệu ₫)', data: dataR, backgroundColor: '#2563eb', borderRadius: 4 }] },
      options: { maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: v => v + 'M' }, grid: { color: '#f2f4f7' } }, x: { grid: { display: false } } } }
    });
    return () => { revChart.current?.destroy(); };
  }, [period]);

  useEffect(() => {
    if (!breakRef.current || !window.Chart) return;
    if (breakChart.current) breakChart.current.destroy();
    breakChart.current = new window.Chart(breakRef.current, {
      type: 'doughnut',
      data: { labels: ['Phòng', 'Ăn uống', 'Spa', 'Đưa đón', 'Khác'], datasets: [{ data: [68, 15, 8, 6, 3], backgroundColor: chartColors, borderWidth: 0 }] },
      options: { maintainAspectRatio: false, cutout: '62%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, padding: 14 } } } }
    });
    return () => { breakChart.current?.destroy(); };
  }, []);

  useEffect(() => {
    if (!occRef.current || !window.Chart) return;
    if (occChart.current) occChart.current.destroy();
    occChart.current = new window.Chart(occRef.current, {
      type: 'bar',
      data: { labels: ['Standard', 'Deluxe', 'Suite', 'Family'], datasets: [{ label: '%', data: [82, 74, 68, 71], backgroundColor: chartColors, borderRadius: 4 }] },
      options: { indexAxis: 'y', maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { max: 100, ticks: { callback: v => v + '%' }, grid: { color: '#f2f4f7' } }, y: { grid: { display: false } } } }
    });
    return () => { occChart.current?.destroy(); };
  }, []);

  const byRoom = {};
  data.bookings.forEach(b => {
    if (b.status === 'cancelled') return;
    b.rooms.split(',').forEach(n => {
      const num = n.trim();
      byRoom[num] = byRoom[num] || { count: 0, revenue: 0 };
      byRoom[num].count++;
      byRoom[num].revenue += b.amount / b.rooms.split(',').length;
    });
  });
  const topRooms = Object.entries(byRoom)
    .map(([num, v]) => ({ num, ...v, type: (data.rooms.find(r => r.number === num) || {}).type || '—' }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  const exportAll = () => {
    toast('Đang chuẩn bị file PDF... (demo — cần thư viện jsPDF)', 'info');
    setTimeout(() => {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'hotel_report.json'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 500);
    }, 600);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Báo cáo &amp; Phân tích</h1>
          <div className="page-sub">Các chỉ số KPI vận hành và tài chính</div>
        </div>
        <div className="page-actions">
          <select value={period} onChange={e => setPeriod(e.target.value)}>
            <option value="4/2026">Tháng 4/2026</option>
            <option value="3/2026">Tháng 3/2026</option>
            <option value="q1/2026">Q1/2026</option>
          </select>
          <button className="btn" onClick={exportAll}>Xuất PDF</button>
        </div>
      </div>

      <div className="two-col" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="card">
          <div className="card-head"><h3 className="card-title">Doanh thu theo ngày</h3></div>
          <div className="card-body" style={{ padding: '16px 18px', height: 320 }}><canvas ref={revRef} /></div>
        </div>
        <div className="card">
          <div className="card-head"><h3 className="card-title">Cơ cấu doanh thu</h3></div>
          <div className="card-body" style={{ padding: '16px 18px', height: 320 }}><canvas ref={breakRef} /></div>
        </div>
      </div>

      <div className="two-col" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <div className="card-head"><h3 className="card-title">Top phòng theo doanh thu</h3></div>
          <table>
            <thead>
              <tr><th>Phòng</th><th>Loại</th><th className="right">Lượt đặt</th><th className="right">Doanh thu</th></tr>
            </thead>
            <tbody>
              {topRooms.length === 0 ? (
                <tr className="empty-row"><td colSpan={4}>Chưa có dữ liệu</td></tr>
              ) : topRooms.map(r => (
                <tr key={r.num}>
                  <td className="strong">{r.num}</td>
                  <td>{r.type}</td>
                  <td className="num right">{r.count}</td>
                  <td className="num right strong">{fmtMoneyShort(r.revenue)} ₫</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <div className="card-head"><h3 className="card-title">Tỷ lệ lấp đầy theo loại phòng</h3></div>
          <div className="card-body" style={{ padding: '16px 18px', height: 300 }}><canvas ref={occRef} /></div>
        </div>
      </div>
    </div>
  );
}
