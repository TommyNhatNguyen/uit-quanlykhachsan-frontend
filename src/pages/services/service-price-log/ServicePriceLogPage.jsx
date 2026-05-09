import { Space, Table, Typography } from "antd";
import { useState } from "react";
import ServicePicker from "../../../components/ServicePicker";
import useServicePriceLogs from "../../../hooks/useServicePriceLogs";

const fmtVND = (v) =>
  typeof v === "number"
    ? v.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    : "—";

export default function ServicePriceLogPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [serviceId, setServiceId] = useState(null);

  const { isLoading, ...result } = useServicePriceLogs({ page, pageSize, serviceId });
  const data = result.data?.data;
  const total = result.data?.total;

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div>
          <Typography.Title level={1}>Lịch sử giá dịch vụ</Typography.Title>
          <Typography.Text type="secondary">
            Xem lịch sử thay đổi giá các dịch vụ
          </Typography.Text>
        </div>
      </div>

      <div className="mb-3">
        <Space>
          <Typography.Text type="secondary">Lọc theo dịch vụ:</Typography.Text>
          <ServicePicker
            value={serviceId}
            onChange={(v) => { setServiceId(v ?? null); setPage(1); }}
            placeholder="Tất cả dịch vụ"
            style={{ minWidth: 220 }}
          />
        </Space>
      </div>

      <Table
        loading={isLoading}
        dataSource={data}
        columns={[
          { title: "ID", dataIndex: "id", key: "id", width: 60 },
          {
            title: "Dịch vụ",
            key: "service",
            render: (_, r) => r.service?.name ?? `#${r.service_id}`,
          },
          {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            align: "right",
            render: (v) => <strong>{fmtVND(v)}</strong>,
          },
          {
            title: "Ngày áp dụng",
            dataIndex: "created_at",
            key: "created_at",
            render: (v) =>
              v
                ? new Date(v).toLocaleString("vi-VN", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })
                : "—",
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
          showTotal: (t) => `Tổng ${t} bản ghi`,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          },
        }}
      />
    </div>
  );
}
