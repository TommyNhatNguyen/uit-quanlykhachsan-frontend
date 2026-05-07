import {
  ApiOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  HomeOutlined,
  ReloadOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Badge, Button, Layout, Menu, Typography } from "antd";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppStateContext } from "../../contexts/AppStateContext";

const { Sider } = Layout;

export default function Sidebar() {
  const { data, resetData: onReset } = useAppStateContext();
  const navigate = useNavigate();
  const location = useLocation();
  const activeBookings = data.bookings.filter(
    (b) => !["cancelled", "checked_out"].includes(b.status),
  ).length;

  const selectedKey =
    location.pathname === "/" ? "dashboard" : location.pathname.slice(1);

  const labelWithCount = (text, count) => (
    <span
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <span>{text}</span>
      <Badge count={count} size="small" color="#6366f1" overflowCount={99} />
    </span>
  );

  const items = [
    {
      type: "group",
      label: "Tổng quan",
      children: [
        {
          key: "dashboard",
          icon: <DashboardOutlined />,
          label: "Dashboard",
          onClick: () => navigate("/"),
        },
      ],
    },
    {
      type: "group",
      label: "Vận hành",
      children: [
        {
          key: "hotel",
          icon: <ShopOutlined />,
          label: "Khách sạn",
          onClick: () => navigate("/hotel"),
        },
        {
          key: "bookings",
          icon: <CalendarOutlined />,
          label: labelWithCount("Đặt phòng", activeBookings),
          onClick: () => navigate("/bookings"),
        },
        {
          key: "rooms",
          icon: <HomeOutlined />,
          label: labelWithCount("Phòng", data.rooms.length),
          onClick: () => navigate("/rooms"),
        },
        {
          key: "customers",
          icon: <TeamOutlined />,
          label: labelWithCount("Khách hàng", data.customers.length),
          onClick: () => navigate("/customers"),
        },
        {
          key: "services",
          icon: <AppstoreOutlined />,
          label: labelWithCount("Dịch vụ", data.services.length),
          onClick: () => navigate("/services"),
        },
      ],
    },
    {
      type: "group",
      label: "Tài chính",
      children: [
        {
          key: "payments",
          icon: <CreditCardOutlined />,
          label: "Thanh toán",
          onClick: () => navigate("/payments"),
        },
        {
          key: "reports",
          icon: <BarChartOutlined />,
          label: "Báo cáo",
          onClick: () => navigate("/reports"),
        },
      ],
    },
    {
      type: "group",
      label: "Hệ thống",
      children: [
        {
          key: "employees",
          icon: <UserOutlined />,
          label: "Nhân viên",
          onClick: () => navigate("/employees"),
        },
        {
          key: "integration",
          icon: <ApiOutlined />,
          label: "Kết nối DB",
          onClick: () => navigate("/integration"),
        },
      ],
    },
  ];

  return (
    <Sider
      width={240}
      breakpoint="md"
      collapsedWidth={64}
      style={{
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
        height: "100vh",
        position: "sticky",
        top: 0,
        overflow: "auto",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: "linear-gradient(135deg,#6366f1,#7c3aed)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          H
        </div>
        <div>
          <Typography.Text
            strong
            style={{ fontSize: 14, display: "block", lineHeight: 1.3 }}
          >
            HotelBooking
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>
            Admin Console
          </Typography.Text>
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={items}
        style={{ border: "none", fontSize: 13 }}
      />

      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #f0f0f0",
          marginTop: 8,
        }}
      >
        <Button
          icon={<ReloadOutlined />}
          type="text"
          danger
          block
          onClick={onReset}
          style={{ textAlign: "left", justifyContent: "flex-start" }}
        >
          Reset dữ liệu
        </Button>
      </div>
    </Sider>
  );
}
