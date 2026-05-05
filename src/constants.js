export const TODAY = '2026-04-23';

export const statusMap = {
  pending:     { label: 'Chờ xác nhận',  color: 'gold',    dot: '#f59e0b' },
  confirmed:   { label: 'Đã xác nhận',   color: 'blue',    dot: '#2563eb' },
  checked_in:  { label: 'Đã nhận phòng', color: 'green',   dot: '#10b981' },
  checked_out: { label: 'Đã trả phòng',  color: 'default', dot: '#6b7280' },
  cancelled:   { label: 'Đã huỷ',        color: 'red',     dot: '#dc2626' },
};

export const paymentMap = {
  paid:     { label: 'Đã thanh toán', color: 'green' },
  partial:  { label: 'Một phần',      color: 'orange' },
  unpaid:   { label: 'Chưa',          color: 'red' },
  refunded: { label: 'Hoàn tiền',     color: 'default' },
};

export const tierMap = {
  Diamond: { color: 'purple' },
  Gold:    { color: 'gold' },
  Silver:  { color: 'default' },
};

export const tierForSpend = v => v >= 50e6 ? 'Diamond' : v >= 20e6 ? 'Gold' : 'Silver';
