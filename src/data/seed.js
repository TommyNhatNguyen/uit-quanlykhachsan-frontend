export function generateRooms() {
  const types = ['Standard', 'Deluxe', 'Suite', 'Family'];
  const typePrices = { 'Standard': 900000, 'Deluxe': 1800000, 'Suite': 3600000, 'Family': 2400000 };
  const typeCaps = { 'Standard': '2 khách', 'Deluxe': '2 khách', 'Suite': '4 khách', 'Family': '5 khách' };
  const typeArea = { 'Standard': '22m²', 'Deluxe': '32m²', 'Suite': '56m²', 'Family': '48m²' };
  const out = [];
  for (let f = 1; f <= 5; f++) {
    for (let r = 1; r <= 10; r++) {
      const number = `${f}${String(r).padStart(2, '0')}`;
      let type = f === 5 ? 'Suite'
               : f === 4 ? (r <= 5 ? 'Family' : 'Suite')
               : f === 1 ? 'Standard'
               : (r <= 5 ? 'Deluxe' : 'Standard');
      const seed = (f * 10 + r) % 10;
      const status = seed < 6 ? 'available' : seed < 9 ? 'occupied' : 'maintenance';
      out.push({
        number, type,
        capacity: typeCaps[type], area: typeArea[type],
        price: typePrices[type],
        smoking: (f * r) % 7 === 0,
        status,
      });
    }
  }
  return out;
}

export const EMPTY_STATE = {
  bookings: [], customers: [], rooms: [], services: [],
  employees: [], payments: [], priceLogs: [], notifications: [],
  counters: { booking: 1, customer: 1, service: 1, employee: 1, payment: 1, price: 1 }
};

export function seedData() {
  return {
    bookings: [
      { id: 'BK-2104', customer: 'Trần Thị Mai', customerId: 3, checkin: '2026-04-22', checkout: '2026-04-25', rooms: '201, 305', status: 'checked_in', payment: 'paid', amount: 4200000, notes: '' },
      { id: 'BK-2103', customer: 'Nguyễn Văn An', customerId: 2, checkin: '2026-04-23', checkout: '2026-04-24', rooms: '102', status: 'confirmed', payment: 'partial', amount: 1800000, notes: '' },
      { id: 'BK-2102', customer: 'Lê Hoàng Minh', customerId: 1, checkin: '2026-04-24', checkout: '2026-04-26', rooms: '501', status: 'pending', payment: 'unpaid', amount: 7200000, notes: 'Yêu cầu phòng tầng cao' },
      { id: 'BK-2101', customer: 'Phạm Thu Hà', customerId: 4, checkin: '2026-04-20', checkout: '2026-04-23', rooms: '208, 209', status: 'checked_out', payment: 'paid', amount: 5400000, notes: '' },
      { id: 'BK-2100', customer: 'Võ Minh Tuấn', customerId: 5, checkin: '2026-04-23', checkout: '2026-04-25', rooms: '304', status: 'cancelled', payment: 'refunded', amount: 0, notes: 'Khách huỷ do đổi lịch' },
      { id: 'BK-2099', customer: 'Đỗ Thị Ngọc', customerId: 6, checkin: '2026-04-23', checkout: '2026-04-27', rooms: '105', status: 'confirmed', payment: 'paid', amount: 3600000, notes: '' },
      { id: 'BK-2098', customer: 'Công ty TNHH Thiên Phúc', customerId: 7, checkin: '2026-04-25', checkout: '2026-04-28', rooms: '401, 402, 403', status: 'confirmed', payment: 'partial', amount: 16200000, notes: 'Đoàn công tác' },
      { id: 'BK-2097', customer: 'Hoàng Văn Đức', customerId: 8, checkin: '2026-04-22', checkout: '2026-04-23', rooms: '203', status: 'checked_out', payment: 'paid', amount: 1800000, notes: '' },
    ],
    customers: [
      { id: 1, name: 'Lê Hoàng Minh', sex: 'Nam', phone: '0901234567', email: 'minh.le@email.com', dob: '1985-03-12', tier: 'Diamond', totalPaid: 68400000, notes: '' },
      { id: 2, name: 'Nguyễn Văn An', sex: 'Nam', phone: '0987654321', email: 'an.nv@email.com', dob: '1990-07-22', tier: 'Silver', totalPaid: 12600000, notes: '' },
      { id: 3, name: 'Trần Thị Mai', sex: 'Nữ', phone: '0912345678', email: 'mai.tran@email.com', dob: '1992-11-04', tier: 'Gold', totalPaid: 31200000, notes: '' },
      { id: 4, name: 'Phạm Thu Hà', sex: 'Nữ', phone: '0923456789', email: 'ha.pham@email.com', dob: '1988-05-17', tier: 'Gold', totalPaid: 24800000, notes: '' },
      { id: 5, name: 'Võ Minh Tuấn', sex: 'Nam', phone: '0934567890', email: 'tuan.vo@email.com', dob: '1995-09-30', tier: 'Silver', totalPaid: 8400000, notes: '' },
      { id: 6, name: 'Đỗ Thị Ngọc', sex: 'Nữ', phone: '0945678901', email: 'ngoc.do@email.com', dob: '1993-02-14', tier: 'Silver', totalPaid: 6900000, notes: '' },
      { id: 7, name: 'Công ty TNHH Thiên Phúc', sex: '—', phone: '02838123456', email: 'info@thienphuc.vn', dob: '2015-01-01', tier: 'Diamond', totalPaid: 52000000, notes: 'Khách doanh nghiệp' },
      { id: 8, name: 'Hoàng Văn Đức', sex: 'Nam', phone: '0956789012', email: 'duc.hv@email.com', dob: '1987-08-19', tier: 'Silver', totalPaid: 4200000, notes: '' },
    ],
    rooms: generateRooms(),
    services: [
      { id: 1, name: 'Bữa sáng buffet', catalog: 'Ăn uống', price: 150000, used: 412 },
      { id: 2, name: 'Bữa tối set menu', catalog: 'Ăn uống', price: 450000, used: 186 },
      { id: 3, name: 'Mini bar', catalog: 'Ăn uống', price: 80000, used: 248 },
      { id: 4, name: 'Spa toàn thân 60 phút', catalog: 'Spa & Wellness', price: 450000, used: 96 },
      { id: 5, name: 'Massage chân 30 phút', catalog: 'Spa & Wellness', price: 250000, used: 142 },
      { id: 6, name: 'Xông hơi khô', catalog: 'Spa & Wellness', price: 180000, used: 78 },
      { id: 7, name: 'Giặt là theo kg', catalog: 'Giặt là', price: 80000, used: 204 },
      { id: 8, name: 'Giặt hấp comple', catalog: 'Giặt là', price: 150000, used: 32 },
      { id: 9, name: 'Đưa đón sân bay', catalog: 'Đưa đón', price: 350000, used: 118 },
      { id: 10, name: 'Thuê xe theo giờ', catalog: 'Đưa đón', price: 250000, used: 54 },
      { id: 11, name: 'Hoa + rượu vang chào đón', catalog: 'Khác', price: 650000, used: 28 },
    ],
    employees: [
      { id: 'EMP-001', name: 'Nguyễn Hoàng Anh', dob: '1995-04-15', phone: '0901111222', position: 'Thu ngân', start: '2022-03-01', working: true },
      { id: 'EMP-002', name: 'Trần Thu Trang', dob: '1998-11-20', phone: '0902222333', position: 'Thu ngân', start: '2023-06-12', working: true },
      { id: 'EMP-003', name: 'Lê Quang Huy', dob: '1990-08-07', phone: '0903333444', position: 'Thu ngân', start: '2020-01-15', working: true },
      { id: 'EMP-004', name: 'Phạm Thanh Vân', dob: '1993-02-28', phone: '0904444555', position: 'Lễ tân', start: '2021-09-01', working: true },
      { id: 'EMP-005', name: 'Vũ Minh Khoa', dob: '1996-07-11', phone: '0905555666', position: 'Lễ tân', start: '2024-02-05', working: true },
      { id: 'EMP-006', name: 'Đặng Kiều Oanh', dob: '1991-12-03', phone: '0906666777', position: 'Buồng phòng', start: '2019-05-20', working: true },
      { id: 'EMP-007', name: 'Bùi Văn Hậu', dob: '1988-06-18', phone: '0907777888', position: 'Buồng phòng', start: '2018-11-10', working: false },
      { id: 'EMP-008', name: 'Ngô Thị Lan', dob: '1985-09-25', phone: '0908888999', position: 'Quản lý', start: '2017-04-01', working: true },
    ],
    payments: [
      { id: 'PAY-3301', bookingId: 'BK-2104', customer: 'Trần Thị Mai', method: 'Thẻ', cashier: 'Nguyễn Hoàng Anh', datetime: '2026-04-23T08:12', amount: 4200000, status: 'success' },
      { id: 'PAY-3300', bookingId: 'BK-2103', customer: 'Nguyễn Văn An', method: 'Tiền mặt', cashier: 'Trần Thu Trang', datetime: '2026-04-23T07:58', amount: 900000, status: 'success' },
      { id: 'PAY-3299', bookingId: 'BK-2101', customer: 'Phạm Thu Hà', method: 'QR', cashier: 'Lê Quang Huy', datetime: '2026-04-23T07:32', amount: 5400000, status: 'success' },
      { id: 'PAY-3298', bookingId: 'BK-2098', customer: 'Công ty TNHH Thiên Phúc', method: 'Chuyển khoản', cashier: 'Nguyễn Hoàng Anh', datetime: '2026-04-23T07:15', amount: 8100000, status: 'success' },
      { id: 'PAY-3297', bookingId: 'BK-2097', customer: 'Hoàng Văn Đức', method: 'Tiền mặt', cashier: 'Trần Thu Trang', datetime: '2026-04-23T06:45', amount: 1800000, status: 'success' },
      { id: 'PAY-3296', bookingId: 'BK-2099', customer: 'Đỗ Thị Ngọc', method: 'Thẻ', cashier: 'Lê Quang Huy', datetime: '2026-04-23T06:20', amount: 3600000, status: 'success' },
      { id: 'PAY-3295', bookingId: 'BK-2100', customer: 'Võ Minh Tuấn', method: 'Tiền mặt', cashier: 'Nguyễn Hoàng Anh', datetime: '2026-04-23T05:50', amount: -1800000, status: 'refund' },
    ],
    priceLogs: [
      { id: 101, roomNumber: '201', from: '2026-01-01', to: '2026-03-31', price: 1500000 },
      { id: 102, roomNumber: '201', from: '2026-04-01', to: null, price: 1800000 },
      { id: 103, roomNumber: '501', from: '2026-02-15', to: null, price: 3600000 },
      { id: 104, roomNumber: '102', from: '2026-04-01', to: null, price: 900000 },
    ],
    notifications: [
      { id: 1, title: 'Booking mới #BK-2104', sub: 'Trần Thị Mai — 2 phòng · 3 đêm', time: '8 phút trước', unread: true, icon: '📅' },
      { id: 2, title: 'Thanh toán thành công', sub: 'PAY-3301 — 4.200.000 ₫', time: '12 phút trước', unread: true, icon: '💳' },
      { id: 3, title: 'Phòng 304 cần bảo trì', sub: 'Ghi nhận từ buồng phòng', time: '1 giờ trước', unread: true, icon: '🔧' },
      { id: 4, title: 'Khách hàng Diamond mới', sub: 'Lê Hoàng Minh đạt chi tiêu 68.4M', time: 'Hôm qua', unread: false, icon: '💎' },
    ],
    counters: { booking: 2105, customer: 9, service: 12, employee: 9, payment: 3302, price: 105 }
  };
}
