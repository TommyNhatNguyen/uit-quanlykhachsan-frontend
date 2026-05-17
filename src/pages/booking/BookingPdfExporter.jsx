import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

console.log("🚀 ~ import.meta.env:", import.meta.env);
Font.register({
  family: "Roboto",
  src: `./roboto-light-webfont.ttf`,
});

const C = {
  primary: "#1d4ed8",
  primaryLight: "#dbeafe",
  success: "#16a34a",
  successLight: "#dcfce7",
  warning: "#d97706",
  warningLight: "#fef3c7",
  danger: "#dc2626",
  gray: "#6b7280",
  lightGray: "#f3f4f6",
  border: "#e5e7eb",
  text: "#111827",
  white: "#ffffff",
};

const STATUS_LABEL = {
  BOOKED: "Đặt phòng",
  CHECKIN: "Check-in",
  CHECKOUT: "Check-out",
  CANCELED: "Đã huỷ",
};
const STATUS_COLOR = {
  BOOKED: C.primary,
  CHECKIN: C.success,
  CHECKOUT: C.gray,
  CANCELED: C.danger,
};

const fmtVND = (v) =>
  typeof v === "number"
    ? v.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    : "—";

const fmtDate = (v) => (v ? new Date(v).toLocaleDateString("vi-VN") : "—");

const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 9,
    color: C.text,
    paddingTop: 32,
    paddingBottom: 52,
    paddingHorizontal: 32,
  },

  // ── Header ────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 14,
    marginBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: C.primary,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 700,
    color: C.primary,
  },
  hotelMeta: {
    fontSize: 8,
    color: C.gray,
    marginTop: 2,
  },
  invoiceLabel: {
    fontSize: 20,
    fontWeight: 700,
    color: C.primary,
    textAlign: "right",
  },
  invoiceSub: {
    fontSize: 8,
    color: C.gray,
    textAlign: "right",
    marginTop: 2,
  },

  // ── Info boxes ────────────────────────────────────────────────
  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  infoBox: {
    flex: 1,
    backgroundColor: C.lightGray,
    borderRadius: 4,
    padding: 10,
  },
  infoBoxTitle: {
    fontSize: 7,
    fontWeight: 700,
    color: C.gray,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 7,
  },
  infoField: {
    flexDirection: "row",
    marginBottom: 3,
  },
  infoLabel: {
    width: 85,
    fontSize: 8,
    color: C.gray,
  },
  infoValue: {
    flex: 1,
    fontSize: 8,
    fontWeight: 700,
  },

  // ── Badge ─────────────────────────────────────────────────────
  badge: {
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 7,
    fontWeight: 700,
  },

  // ── Section heading ───────────────────────────────────────────
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: C.primary,
    marginBottom: 6,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },

  // ── Table ─────────────────────────────────────────────────────
  table: { marginBottom: 18 },
  tableHead: {
    flexDirection: "row",
    backgroundColor: C.primary,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 2,
  },
  th: {
    color: C.white,
    fontWeight: 700,
    fontSize: 7.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  tableRowAlt: {
    backgroundColor: "#f9fafb",
  },
  td: { fontSize: 8 },

  // column widths (landscape A4 usable ≈ 781pt − 64 padding = 717pt)
  cRoom: { width: "17%" },
  cDate: { width: "9%" },
  cNights: { width: "6%", textAlign: "center" },
  cPrice: { width: "12%", textAlign: "right" },
  cRoomAmt: { width: "11%", textAlign: "right" },
  cSvcAmt: { width: "10%", textAlign: "right" },
  cTotal: { width: "11%", textAlign: "right" },
  cPaid: { width: "11%", textAlign: "right" },
  cRest: { width: "11%", textAlign: "right" },
  cStatus: { width: "12%" },

  // ── Summary ───────────────────────────────────────────────────
  summaryWrap: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 18,
  },
  summaryBox: {
    width: 230,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  summaryRowHighlight: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: C.primary,
  },
  summaryLabel: { fontSize: 8, color: C.gray },
  summaryValue: { fontSize: 8, fontWeight: 700 },
  summaryLabelHL: { fontSize: 9, fontWeight: 700, color: C.white },
  summaryValueHL: { fontSize: 9, fontWeight: 700, color: C.white },

  // ── Notes ─────────────────────────────────────────────────────
  notesBox: {
    backgroundColor: C.lightGray,
    borderRadius: 4,
    padding: 10,
    marginBottom: 18,
  },
  notesTitle: {
    fontSize: 7,
    fontWeight: 700,
    color: C.gray,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  notesText: { fontSize: 8, lineHeight: 1.5 },

  // ── Footer ────────────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 20,
    left: 32,
    right: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  footerText: { fontSize: 7, color: C.gray },
});

function Badge({ label, bgColor, textColor }) {
  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

function TableHeader() {
  return (
    <View style={styles.tableHead}>
      <Text style={[styles.th, styles.cRoom]}>Phòng</Text>
      <Text style={[styles.th, styles.cDate]}>Check-in</Text>
      <Text style={[styles.th, styles.cDate]}>Check-out</Text>
      <Text style={[styles.th, styles.cNights]}>Đêm</Text>
      <Text style={[styles.th, styles.cPrice]}>Giá/đêm</Text>
      <Text style={[styles.th, styles.cRoomAmt]}>Tiền phòng</Text>
      <Text style={[styles.th, styles.cSvcAmt]}>Tiền DV</Text>
      <Text style={[styles.th, styles.cTotal]}>Tổng</Text>
      <Text style={[styles.th, styles.cPaid]}>Đã TT</Text>
      <Text style={[styles.th, styles.cRest]}>Còn lại</Text>
      <Text style={[styles.th, styles.cStatus]}>Trạng thái</Text>
    </View>
  );
}

function TableRow({ detail, index }) {
  const roomLabel = detail.room
    ? `#${detail.room.room_num} – ${detail.room.room_name}`
    : `Phòng #${detail.room_id}`;
  const rest = (detail.total_amount ?? 0) - (detail.total_payment ?? 0);
  const statusLabel = STATUS_LABEL[detail.status] ?? detail.status;
  const statusColor = STATUS_COLOR[detail.status] ?? C.gray;

  return (
    <View
      style={[styles.tableRow, index % 2 !== 0 && styles.tableRowAlt]}
      wrap={false}
    >
      <Text style={[styles.td, styles.cRoom]}>{roomLabel}</Text>
      <Text style={[styles.td, styles.cDate]}>
        {fmtDate(detail.checkin_date)}
      </Text>
      <Text style={[styles.td, styles.cDate]}>
        {fmtDate(detail.checkout_date)}
      </Text>
      <Text style={[styles.td, styles.cNights]}>
        {detail.quantity_of_nights}
      </Text>
      <Text style={[styles.td, styles.cPrice]}>
        {fmtVND(detail.price_per_night)}
      </Text>
      <Text style={[styles.td, styles.cRoomAmt]}>
        {fmtVND(detail.total_room_amount)}
      </Text>
      <Text style={[styles.td, styles.cSvcAmt]}>
        {fmtVND(detail.total_service_amount ?? 0)}
      </Text>
      <Text style={[styles.td, styles.cTotal, { fontWeight: 700 }]}>
        {fmtVND(detail.total_amount)}
      </Text>
      <Text style={[styles.td, styles.cPaid, { color: C.success }]}>
        {fmtVND(detail.total_payment ?? 0)}
      </Text>
      <Text
        style={[
          styles.td,
          styles.cRest,
          { color: rest > 0 ? C.danger : C.success },
        ]}
      >
        {fmtVND(rest)}
      </Text>
      <View style={styles.cStatus}>
        <Badge
          label={statusLabel}
          bgColor={statusColor + "22"}
          textColor={statusColor}
        />
      </View>
    </View>
  );
}

export default function BookingDocument({ booking }) {
  if (!booking) return null;

  const details = Array.isArray(booking.booking_details)
    ? booking.booking_details
    : [];
  const totalAmount = details.reduce((s, d) => s + (d.total_amount ?? 0), 0);
  const totalPaid = details.reduce((s, d) => s + (d.total_payment ?? 0), 0);
  const totalService = details.reduce(
    (s, d) => s + (d.total_service_amount ?? 0),
    0,
  );
  const remaining = totalAmount - totalPaid;

  const customerName =
    booking.customer?.name ?? `Khách #${booking.customer_id}`;

  return (
    <Document
      title={`Phiếu đặt phòng #${booking.id}`}
      author="Quản lý khách sạn"
    >
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.hotelName}>KHÁCH SẠN</Text>
            <Text style={styles.hotelMeta}>Hệ thống quản lý khách sạn</Text>
          </View>
          <View>
            <Text style={styles.invoiceLabel}>PHIẾU ĐẶT PHÒNG</Text>
            <Text style={styles.invoiceSub}>Số phiếu: #{booking.id}</Text>
            <Text style={styles.invoiceSub}>
              Ngày tạo: {fmtDate(booking.created_at)}
            </Text>
          </View>
        </View>

        {/* ── Info boxes ── */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>Thông tin khách hàng</Text>
            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Họ tên:</Text>
              <Text style={styles.infoValue}>{customerName}</Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>Trạng thái thanh toán</Text>
            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Trạng thái:</Text>
              {booking.is_fully_paid ? (
                <Badge
                  label="Đã thanh toán đủ"
                  bgColor={C.successLight}
                  textColor={C.success}
                />
              ) : (
                <Badge
                  label="Chưa thanh toán đủ"
                  bgColor={C.warningLight}
                  textColor={C.warning}
                />
              )}
            </View>
            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Số phòng:</Text>
              <Text style={styles.infoValue}>{details.length} phòng</Text>
            </View>
          </View>
        </View>

        {/* ── Room details table ── */}
        <Text style={styles.sectionTitle}>Chi tiết phòng</Text>
        <View style={styles.table}>
          <TableHeader />
          {details.length === 0 ? (
            <View style={[styles.tableRow, { justifyContent: "center" }]}>
              <Text style={[styles.td, { color: C.gray }]}>
                Không có chi tiết phòng
              </Text>
            </View>
          ) : (
            details.map((d, i) => <TableRow key={d.id} detail={d} index={i} />)
          )}
        </View>

        {/* ── Summary ── */}
        <View style={styles.summaryWrap}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tiền phòng:</Text>
              <Text style={styles.summaryValue}>
                {fmtVND(totalAmount - totalService)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tiền dịch vụ:</Text>
              <Text style={styles.summaryValue}>{fmtVND(totalService)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tổng cộng:</Text>
              <Text style={[styles.summaryValue, { color: C.text }]}>
                {fmtVND(totalAmount)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Đã thanh toán:</Text>
              <Text style={[styles.summaryValue, { color: C.success }]}>
                {fmtVND(totalPaid)}
              </Text>
            </View>
            <View style={styles.summaryRowHighlight}>
              <Text style={styles.summaryLabelHL}>Còn lại:</Text>
              <Text style={styles.summaryValueHL}>{fmtVND(remaining)}</Text>
            </View>
          </View>
        </View>

        {/* ── Notes ── */}
        {booking.notes && (
          <View style={styles.notesBox}>
            <Text style={styles.notesTitle}>Ghi chú</Text>
            <Text style={styles.notesText}>{booking.notes}</Text>
          </View>
        )}

        {/* ── Footer (fixed on every page) ── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Phiếu đặt phòng #{booking.id} — {customerName} — Ngày tạo:{" "}
            {fmtDate(booking.created_at)}
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `Trang ${pageNumber}/${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
