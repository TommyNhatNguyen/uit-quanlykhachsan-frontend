export const fmtVND = n => new Intl.NumberFormat('vi-VN').format(n);

export const fmtDate = s => {
  if (!s) return '—';
  const [y, m, d] = s.split('-');
  return `${d}/${m}/${y.slice(2)}`;
};

export const fmtDateTime = s => {
  if (!s) return '—';
  const [d, t] = s.split('T');
  return `${fmtDate(d)} ${(t || '').slice(0, 5)}`;
};

export const fmtMoneyShort = n => {
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
};

export function toCSV(rows, headers) {
  const esc = v => {
    if (v == null) return '';
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const head = headers.map(h => esc(h.label)).join(',');
  const body = rows.map(r => headers.map(h => esc(typeof h.v === 'function' ? h.v(r) : r[h.key])).join(',')).join('\n');
  return '﻿' + head + '\n' + body;
}

export function downloadCSV(name, content) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}
