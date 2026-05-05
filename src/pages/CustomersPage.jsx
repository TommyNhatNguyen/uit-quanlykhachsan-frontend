import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  Row,
  Select,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import React, { useState } from "react";
import { tierMap, TODAY } from "../constants";
import { useAppStateContext } from "../contexts/AppStateContext";
import { useCustomerContext } from "../contexts/CustomerContext";
import { downloadCSV, fmtDate, fmtVND, toCSV } from "../utils";

export default function CustomersPage() {
  const { data } = useAppStateContext();
  const customers = useCustomerContext();
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [sort, setSort] = useState("new");

  let list = [...data.customers];
  if (tierFilter !== "all") list = list.filter((c) => c.tier === tierFilter);
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email || "").toLowerCase().includes(q),
    );
  }
  if (sort === "new") list.sort((a, b) => b.id - a.id);
  else if (sort === "old") list.sort((a, b) => a.id - b.id);
  else if (sort === "top") list.sort((a, b) => b.totalPaid - a.totalPaid);

  const exportCSV = () => {
    const csv = toCSV(data.customers, [
      { label: "Họ tên", key: "name" },
      { label: "Giới tính", key: "sex" },
      { label: "SĐT", key: "phone" },
      { label: "Email", key: "email" },
      { label: "Ngày sinh", key: "dob" },
      { label: "Hạng", key: "tier" },
      { label: "Tổng chi tiêu", key: "totalPaid" },
    ]);
    downloadCSV(`customers_${TODAY}.csv`, csv);
  };

  const buildActions = (c) => [
    {
      key: "detail",
      label: "👁 Hồ sơ",
      onClick: () => customers.openDetail(c.id),
    },
    { key: "edit", label: "✎ Sửa", onClick: () => customers.openForm(c.id) },
    {
      key: "booking",
      label: "📅 Tạo booking",
      onClick: () => customers.openBookingForm?.(c.id),
    },
    { type: "divider" },
    {
      key: "delete",
      label: "🗑 Xoá",
      danger: true,
      onClick: () => customers.deleteCustomer(c.id),
    },
  ];

  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "name",
      render: (v) => <strong>{v}</strong>,
    },
    { title: "Giới tính", dataIndex: "sex" },
    { title: "SĐT", dataIndex: "phone" },
    {
      title: "Email",
      dataIndex: "email",
      render: (v) => (
        <Typography.Text type="secondary">{v || "—"}</Typography.Text>
      ),
    },
    { title: "Ngày sinh", dataIndex: "dob", render: fmtDate },
    {
      title: "Hạng",
      dataIndex: "tier",
      render: (v) => <Tag color={tierMap[v].color}>{v}</Tag>,
    },
    {
      title: "Tổng chi tiêu",
      dataIndex: "totalPaid",
      align: "right",
      render: (v) => <strong>{fmtVND(v)}</strong>,
    },
    {
      title: "",
      key: "actions",
      width: 50,
      render: (_, c) => (
        <Dropdown menu={{ items: buildActions(c) }} trigger={["click"]}>
          <Button size="small" type="text" onClick={(e) => e.stopPropagation()}>
            ⋯
          </Button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Khách hàng
          </Typography.Title>
          <Typography.Text type="secondary">
            Danh sách khách hàng, hạng thành viên và lịch sử giao dịch
          </Typography.Text>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button icon={<DownloadOutlined />} onClick={exportCSV}>
            Xuất CSV
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => customers.openForm()}
          >
            Thêm khách hàng
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Tổng khách hàng" value={data.customers.length} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Diamond"
              value={data.customers.filter((c) => c.tier === "Diamond").length}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Gold"
              value={data.customers.filter((c) => c.tier === "Gold").length}
              valueStyle={{ color: "#d48806" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Silver"
              value={data.customers.filter((c) => c.tier === "Silver").length}
            />
          </Card>
        </Col>
      </Row>

      <div
        style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}
      >
        <Input.Search
          placeholder="Tìm theo tên, SĐT, email…"
          style={{ flex: 1, maxWidth: 320 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
        <Select
          value={tierFilter}
          onChange={setTierFilter}
          style={{ width: 140 }}
          options={[
            { value: "all", label: "Tất cả hạng" },
            { value: "Diamond" },
            { value: "Gold" },
            { value: "Silver" },
          ]}
        />
        <Select
          value={sort}
          onChange={setSort}
          style={{ width: 160 }}
          options={[
            { value: "new", label: "Mới → Cũ" },
            { value: "old", label: "Cũ → Mới" },
            { value: "top", label: "Chi tiêu cao nhất" },
          ]}
        />
      </div>

      <Card>
        <Table
          dataSource={list}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 20, showSizeChanger: false }}
          locale={{ emptyText: "Không có khách hàng nào" }}
          onRow={(c) => ({
            onClick: () => customers.openDetail(c.id),
            style: { cursor: "pointer" },
          })}
        />
      </Card>
    </div>
  );
}
