import {
  AppstoreOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  DollarOutlined,
  HomeOutlined,
  IdcardOutlined,
  ShopOutlined,
  TagsOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Badge, Layout, Menu, Typography } from "antd";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const { Sider } = Layout;

export default function Sidebar() {
  const data = {};
  const navigate = useNavigate();
  const location = useLocation();

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
          key: "rooms",
          icon: <HomeOutlined />,
          label: labelWithCount("Quản lý phòng", 0),
          navigate: "/room",
          children: [
            {
              key: "room-list",
              icon: <UnorderedListOutlined />,
              label: labelWithCount("Danh sách phòng", 0),
              navigate: "/room-list",
              onClick: () => navigate("/room-list"),
            },
            {
              key: "room-type",
              icon: <TagsOutlined />,
              label: labelWithCount("Cấu hình loại phòng", 0),
              navigate: "/room-type",
              onClick: () => navigate("/room-type"),
            },
            {
              key: "room-price",
              icon: <DollarOutlined />,
              label: labelWithCount("Lịch sử giá phòng", 0),
              navigate: "/room-price",
              onClick: () => navigate("/room-price"),
            },
          ],
        },
        {
          key: "bookings",
          icon: <CalendarOutlined />,
          label: labelWithCount("Đặt phòng", 0),
          onClick: () => navigate("/bookings"),
        },
        {
          key: "customers",
          icon: <TeamOutlined />,
          label: labelWithCount("Khách hàng", 0),
          onClick: () => navigate("/customers"),
        },
        {
          key: "membership",
          icon: <IdcardOutlined />,
          label: labelWithCount("Quản lý thành viên", 0),
          onClick: () => navigate("/membership"),
        },
        {
          key: "services-group",
          icon: <AppstoreOutlined />,
          label: "Dịch vụ",
          children: [
            {
              key: "services",
              icon: <UnorderedListOutlined />,
              label: "Danh sách dịch vụ",
              onClick: () => navigate("/services"),
            },
            {
              key: "service-details",
              icon: <TagsOutlined />,
              label: "Sử dụng dịch vụ",
              onClick: () => navigate("/service-details"),
            },
            {
              key: "service-price-log",
              icon: <DollarOutlined />,
              label: "Lịch sử giá dịch vụ",
              onClick: () => navigate("/service-price-log"),
            },
          ],
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
    </Sider>
  );
}
