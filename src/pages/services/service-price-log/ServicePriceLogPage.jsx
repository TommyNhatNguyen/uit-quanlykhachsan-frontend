import { Input, Space, Table, Tag, Typography } from "antd";
import { useState } from "react";
import { useServiceItemHistoryPrices } from "../../../hooks/useServiceItems";
import useServiceItems from "../../../hooks/useServiceItems";

const fmtVND = (v) =>
  typeof v === "number"
    ? v.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    : "—";

const fmtDate = (v) =>
  v
    ? new Date(v).toLocaleString("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "—";

function ServicePriceHistory({ serviceId }) {
  const { data, isLoading } = useServiceItemHistoryPrices(serviceId);
  const records = Array.isArray(data) ? data : (data?.data ?? []);

  return (
    <Table
      loading={isLoading}
      dataSource={records}
      columns={[
        {
          title: "Ngày áp dụng",
          dataIndex: "created_at",
          key: "created_at",
          render: fmtDate,
        },
        {
          title: "Giá",
          dataIndex: "price",
          key: "price",
          align: "right",
          render: (v) => <strong>{fmtVND(v)}</strong>,
        },
      ]}
      rowKey="id"
      size="small"
      pagination={false}
      locale={{ emptyText: "Không có lịch sử giá" }}
      style={{ marginLeft: 48 }}
    />
  );
}

export default function ServicePriceLogPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const { isLoading, ...result } = useServiceItems({ page, pageSize });
  const allData = result.data?.data ?? [];
  const total = result.data?.total;

  const data = search
    ? allData.filter(
        (s) =>
          s.name?.toLowerCase().includes(search.toLowerCase()) ||
          s.catalog?.toLowerCase().includes(search.toLowerCase())
      )
    : allData;

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div>
          <Typography.Title level={1}>Lịch sử giá dịch vụ</Typography.Title>
          <Typography.Text type="secondary">
            Xem giá hiện tại và lịch sử thay đổi giá từng dịch vụ
          </Typography.Text>
        </div>
      </div>

      <div className="mb-3">
        <Space>
          <Typography.Text type="secondary">Tìm kiếm:</Typography.Text>
          <Input.Search
            placeholder="Tên hoặc danh mục dịch vụ"
            allowClear
            style={{ minWidth: 260 }}
            onSearch={(v) => { setSearch(v); setPage(1); }}
            onChange={(e) => { if (!e.target.value) { setSearch(""); setPage(1); } }}
          />
        </Space>
      </div>

      <Table
        loading={isLoading}
        dataSource={data}
        expandable={{
          expandedRowRender: (record) => (
            <ServicePriceHistory serviceId={record.id} />
          ),
          rowExpandable: () => true,
        }}
        columns={[
          { title: "ID", dataIndex: "id", key: "id", width: 60 },
          {
            title: "Tên dịch vụ",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Danh mục",
            dataIndex: "catalog",
            key: "catalog",
            render: (v) => v || "—",
          },
          {
            title: "Giá hiện tại",
            dataIndex: "current_price",
            key: "current_price",
            align: "right",
            render: (v) => (
              <Tag color="blue" style={{ fontWeight: 600 }}>
                {fmtVND(v)}
              </Tag>
            ),
          },
        ]}
        rowKey="id"
        size="small"
        locale={{ emptyText: "Không có dữ liệu" }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t) => `Tổng ${t} dịch vụ`,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          },
        }}
      />
    </div>
  );
}
