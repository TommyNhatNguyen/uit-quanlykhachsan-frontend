import { ReloadOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  message,
  Row,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { useMemo } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  useStatsKpiToday,
  useStatsRecentBookings,
  useStatsRevenue7Days,
  useStatsRoomTypeDistribution,
  useStatsTopCustomers,
} from "../../hooks/useStats";
import { fmtDate, fmtMoneyShort, fmtVND } from "../../utils";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Tooltip,
);

const bookingStatusMap = {
  BOOKED: { label: "Đã đặt", color: "blue" },
  CHECKIN: { label: "Đã nhận phòng", color: "green" },
  CHECKOUT: { label: "Đã trả phòng", color: "default" },
  CANCELED: { label: "Đã huỷ", color: "red" },
};

const tierColorMap = { VIP: "purple", Thường: "default" };

const membershipColorMap = {
  Diamond: "purple",
  Platinum: "geekblue",
  Gold: "gold",
  Silver: "default",
};

const fmtDdMmYyyy = (s) => {
  if (!s) return "—";
  const [y, m, d] = String(s).slice(0, 10).split("-");
  if (!y || !m || !d) return s;
  return `${d}-${m}-${y}`;
};

const palette = [
  "#6366f1",
  "#7c3aed",
  "#059669",
  "#d97706",
  "#dc2626",
  "#0ea5e9",
  "#ec4899",
  "#14b8a6",
];

const legendBottom = {
  position: "bottom",
  labels: {
    boxWidth: 10,
    boxHeight: 10,
    usePointStyle: true,
    padding: 14,
  },
};

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const kpiQuery = useStatsKpiToday();
  const revenueQuery = useStatsRevenue7Days();
  const roomTypeQuery = useStatsRoomTypeDistribution();
  const recentQuery = useStatsRecentBookings({ limit: 10 });
  const topCustomersQuery = useStatsTopCustomers({ limit: 5 });

  const kpi = kpiQuery.data || {};
  const revenueRows = useMemo(
    () => revenueQuery.data || [],
    [revenueQuery.data],
  );
  const roomTypes = useMemo(
    () => roomTypeQuery.data || [],
    [roomTypeQuery.data],
  );
  const recent = recentQuery.data || [];
  const topCustomers = useMemo(
    () => topCustomersQuery.data || [],
    [topCustomersQuery.data],
  );

  const now = new Date();
  const totalRev7d = useMemo(
    () => revenueRows.reduce((s, r) => s + (Number(r.total_revenue) || 0), 0),
    [revenueRows],
  );

  const revenueChart = useMemo(() => {
    return {
      data: {
        labels: revenueRows.map((r) => fmtDdMmYyyy(r.revenue_date)),
        datasets: [
          {
            label: "Phòng",
            data: revenueRows.map((r) => Number(r.room_revenue) || 0),
            backgroundColor: "#6366f1",
            borderRadius: { topLeft: 6, topRight: 6 },
            borderSkipped: false,
            maxBarThickness: 36,
            stack: "revenue",
          },
          {
            label: "Dịch vụ",
            data: revenueRows.map((r) => Number(r.service_revenue) || 0),
            backgroundColor: "#a78bfa",
            borderRadius: { topLeft: 6, topRight: 6 },
            borderSkipped: false,
            maxBarThickness: 36,
            stack: "revenue",
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: legendBottom,
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${fmtVND(ctx.parsed.y)} ₫`,
              footer: (items) => {
                const sum = items.reduce(
                  (s, it) => s + (Number(it.parsed.y) || 0),
                  0,
                );
                return `Tổng: ${fmtVND(sum)} ₫`;
              },
            },
          },
        },
        scales: {
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: { callback: (v) => fmtMoneyShort(v) },
            grid: { color: "#f5f5f5", drawBorder: false },
            border: { display: false },
          },
          x: {
            stacked: true,
            grid: { display: false },
            border: { display: false },
            ticks: { font: { size: 11 } },
          },
        },
      },
    };
  }, [revenueRows]);

  const roomTypeChart = useMemo(() => {
    return {
      data: {
        labels: roomTypes.map((r) => r.room_type_name || `#${r.room_type_id}`),
        datasets: [
          {
            data: roomTypes.map((r) => Number(r.total_rooms) || 0),
            backgroundColor: roomTypes.map(
              (_, i) => palette[i % palette.length],
            ),
            borderWidth: 0,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        cutout: "62%",
        plugins: {
          legend: legendBottom,
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const row = roomTypes[ctx.dataIndex] || {};
                return `${ctx.label}: ${ctx.parsed} phòng (${
                  row.room_type_pct ?? 0
                }%)`;
              },
            },
          },
        },
      },
    };
  }, [roomTypes]);

  const topCustomersChart = useMemo(() => {
    return {
      data: {
        labels: topCustomers.map((c) => c.customer_name || `#${c.customer_id}`),
        datasets: [
          {
            label: "Tổng giá trị booking",
            data: topCustomers.map((c) => Number(c.total_booking_amount) || 0),
            backgroundColor: "rgba(99,102,241,.85)",
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: "Đã thanh toán",
            data: topCustomers.map((c) => Number(c.total_paid) || 0),
            backgroundColor: "rgba(34,197,94,.85)",
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        indexAxis: "y",
        plugins: {
          legend: legendBottom,
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${fmtVND(ctx.parsed.x)} ₫`,
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { callback: (v) => fmtMoneyShort(v) },
            grid: { color: "#f5f5f5" },
          },
          y: { grid: { display: false } },
        },
      },
    };
  }, [topCustomers]);

  const occupancyDonut = useMemo(() => {
    const occ = Number(kpi.occupied_rooms_today) || 0;
    const total = Number(kpi.total_active_rooms) || 0;
    const free = Math.max(total - occ, 0);
    return {
      data: {
        labels: ["Đang dùng", "Trống"],
        datasets: [
          {
            data: [occ, free],
            backgroundColor: ["#6366f1", "#e5e7eb"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        cutout: "72%",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed}` },
          },
        },
      },
    };
  }, [kpi.occupied_rooms_today, kpi.total_active_rooms]);

  const bookingColumns = [
    {
      title: "Mã",
      dataIndex: "booking_id",
      width: 80,
      render: (v) => <strong>#{v}</strong>,
    },
    {
      title: "Khách",
      dataIndex: "customer_name",
      render: (v, r) => (
        <div>
          <div>{v || "—"}</div>
          {r.customer_phone && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {r.customer_phone}
            </Typography.Text>
          )}
        </div>
      ),
    },
    {
      title: "Phòng",
      dataIndex: "room_num",
      render: (v, r) => (
        <div>
          <div>{v || r.room_name || "—"}</div>
          {r.room_type && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {r.room_type}
            </Typography.Text>
          )}
        </div>
      ),
    },
    {
      title: "Nhận phòng",
      dataIndex: "checkin_date",
      render: (v) => fmtDate(v),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (v) => {
        const m = bookingStatusMap[v] || { label: v, color: "default" };
        return <Tag color={m.color}>{m.label}</Tag>;
      },
    },
    {
      title: "Tiền",
      dataIndex: "total_amount",
      align: "right",
      render: (v) => fmtVND(v || 0),
    },
  ];

  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["stats"] });
    message.success("Đã làm mới dashboard");
  };

  const occupancyPct = Number(kpi.occupancy_rate_pct) || 0;
  const isAnyFetching =
    kpiQuery.isFetching ||
    revenueQuery.isFetching ||
    roomTypeQuery.isFetching ||
    recentQuery.isFetching ||
    topCustomersQuery.isFetching;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Dashboard
          </Typography.Title>
          <Typography.Text type="secondary">
            Tổng quan hoạt động — cập nhật lúc{" "}
            {String(now.getHours()).padStart(2, "0")}:
            {String(now.getMinutes()).padStart(2, "0")}
          </Typography.Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={onRefresh}
          loading={isAnyFetching}
        >
          Làm mới
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card loading={kpiQuery.isLoading}>
            <Statistic
              title="📅 Booking hôm nay"
              value={kpi.total_bookings_today ?? 0}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={kpiQuery.isLoading}>
            <Statistic
              title="💰 Doanh thu hôm nay"
              value={fmtMoneyShort(kpi.total_revenue_today || 0)}
              suffix="₫"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={kpiQuery.isLoading}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <Statistic
                  title="🏨 Tỷ lệ lấp đầy"
                  value={occupancyPct}
                  precision={occupancyPct % 1 ? 2 : 0}
                  suffix="%"
                />
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {kpi.occupied_rooms_today ?? 0}/{kpi.total_active_rooms ?? 0}{" "}
                  phòng
                </Typography.Text>
              </div>
              <div style={{ width: 64, height: 64 }}>
                <Doughnut
                  data={occupancyDonut.data}
                  options={occupancyDonut.options}
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={kpiQuery.isLoading}>
            <Statistic
              title="👥 Khách hàng hôm nay"
              value={kpi.total_customers_today ?? 0}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={16}>
          <Card
            loading={revenueQuery.isLoading}
            title={
              <div>
                <div>Doanh thu 7 ngày qua</div>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Tổng: <strong>{fmtVND(totalRev7d)} ₫</strong>
                </Typography.Text>
              </div>
            }
            styles={{ body: { padding: "16px 18px", height: 320 } }}
          >
            <div style={{ height: "100%" }}>
              <Bar data={revenueChart.data} options={revenueChart.options} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            loading={roomTypeQuery.isLoading}
            title="Phân bố loại phòng"
            styles={{ body: { padding: "16px 18px", height: 320 } }}
          >
            <div style={{ height: "100%" }}>
              <Doughnut
                data={roomTypeChart.data}
                options={roomTypeChart.options}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={14}>
          <Card
            title="Booking gần đây"
            extra={
              <Button
                type="link"
                size="small"
                onClick={() => navigate("/bookings")}
              >
                Xem tất cả →
              </Button>
            }
          >
            <Table
              loading={recentQuery.isLoading}
              dataSource={recent}
              columns={bookingColumns}
              rowKey="booking_detail_id"
              size="small"
              pagination={false}
              locale={{ emptyText: "Chưa có booking" }}
            />
          </Card>
        </Col>
        <Col xs={24} md={10}>
          <Card
            title="Top khách hàng theo chi tiêu"
            extra={
              <Button
                type="link"
                size="small"
                onClick={() => navigate("/customers")}
              >
                Xem tất cả →
              </Button>
            }
            loading={topCustomersQuery.isLoading}
            styles={{ body: { padding: "16px 18px" } }}
          >
            <div
              style={{
                height: Math.max(220, topCustomers.length * 58 + 40),
              }}
            >
              {topCustomers.length > 0 ? (
                <Bar
                  data={topCustomersChart.data}
                  options={topCustomersChart.options}
                />
              ) : (
                <Typography.Text type="secondary">
                  Chưa có khách hàng
                </Typography.Text>
              )}
            </div>
            {topCustomers.length > 0 && (
              <div style={{ marginTop: 12 }}>
                {topCustomers.map((c) => {
                  const total = Number(c.total_booking_amount) || 0;
                  const paid = Number(c.total_paid) || 0;
                  return (
                    <div
                      key={c.customer_id}
                      style={{
                        padding: "10px 0",
                        borderTop: "1px solid #f0f0f0",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 8,
                          alignItems: "flex-start",
                        }}
                      >
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              flexWrap: "wrap",
                            }}
                          >
                            <strong>
                              {c.customer_name || `#${c.customer_id}`}
                            </strong>
                            {c.membership_name && (
                              <Tag
                                color={
                                  membershipColorMap[c.membership_name] ||
                                  "blue"
                                }
                                style={{ marginInlineEnd: 0 }}
                              >
                                {c.membership_name}
                              </Tag>
                            )}
                            <Tag
                              color={tierColorMap[c.customer_tier] || "default"}
                              style={{ marginInlineEnd: 0 }}
                            >
                              {c.customer_tier || "Thường"}
                            </Tag>
                          </div>
                          <Typography.Text
                            type="secondary"
                            style={{ fontSize: 12 }}
                          >
                            {[
                              c.phone,
                              c.email,
                              c.last_booking_date &&
                                `Gần nhất: ${fmtDate(c.last_booking_date)}`,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </Typography.Text>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div>
                            <strong>{fmtVND(total)} ₫</strong>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: 6,
                          fontSize: 12,
                        }}
                      >
                        <Typography.Text type="secondary">
                          Số lần booking: {c.total_bookings ?? 0} lần ·{" "}
                          {c.total_nights ?? 0} đêm
                        </Typography.Text>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
