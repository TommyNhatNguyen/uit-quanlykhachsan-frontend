export const TODAY = '2026-04-23';

export const statusMap = {
  pending:     { label: 'Chờ xác nhận',  cls: 'b-warning', dot: '#f59e0b' },
  confirmed:   { label: 'Đã xác nhận',   cls: 'b-primary', dot: '#2563eb' },
  checked_in:  { label: 'Đã nhận phòng', cls: 'b-success', dot: '#10b981' },
  checked_out: { label: 'Đã trả phòng',  cls: '',          dot: '#6b7280' },
  cancelled:   { label: 'Đã huỷ',        cls: 'b-danger',  dot: '#dc2626' },
};

export const paymentMap = {
  paid:     { label: 'Đã thanh toán', cls: 'b-success' },
  partial:  { label: 'Một phần',      cls: 'b-warning' },
  unpaid:   { label: 'Chưa',          cls: 'b-danger' },
  refunded: { label: 'Hoàn tiền',     cls: '' },
};

export const tierMap = { 'Diamond': 'b-purple', 'Gold': 'b-warning', 'Silver': '' };

export const tierForSpend = v => v >= 50e6 ? 'Diamond' : v >= 20e6 ? 'Gold' : 'Silver';
