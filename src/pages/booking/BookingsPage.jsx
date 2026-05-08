import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Badge, Button, Space, Table, Tooltip, Typography } from "antd";
import { useState } from "react";
import useBookings from "../../hooks/useBookings";
import { DeleteFormTrigger } from "./DeleteForm";
import { DetailModalTrigger } from "./DetailModal";
import { UpsertFormTrigger } from "./UpsertForm";

const fmtVND = (v) =>
  typeof v === "number"
    ? v.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    : "—";

const fmtDate = (v) => (v ? new Date(v).toLocaleDateString("vi-VN") : "—");

const STATUS_COLOR = {
  BOOKED: "blue",
  CHECKIN: "green",
  CHECKOUT: "default",
  CANCELED: "red",
};
const STATUS_LABEL = {
  BOOKED: "Đặt phòng",
  CHECKIN: "Check-in",
  CHECKOUT: "Check-out",
  CANCELED: "Đã huỷ",
};

export default function BookingsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { isLoading, ...result } = useBookings({ page, pageSize });
  const data = result.data?.data;
  const total = result.data?.total;

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div>
          <Typography.Title level={1}>Quản lý đặt phòng</Typography.Title>
          <Typography.Text type="secondary">
            Danh sách tất cả đặt phòng trong hệ thống
          </Typography.Text>
        </div>
        <Space>
          <UpsertFormTrigger>
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm đặt phòng
            </Button>
          </UpsertFormTrigger>
        </Space>
      </div>
      <div>
        <Table
          loading={isLoading}
          dataSource={data}
          expandable={{
            expandedRowRender: (record) => {
              const details = record.booking_details ?? [];
              return (
                <Table
                  dataSource={details}
                  rowKey="id"
                  size="small"
                  pagination={false}
                  style={{ margin: "0 8px" }}
                  columns={[
                    {
                      title: "Phòng",
                      key: "room",
                      render: (_, d) =>
                        d.room
                          ? `#${d.room.room_num} — ${d.room.room_name}`
                          : `Phòng #${d.room_id}`,
                    },
                    {
                      title: "Check-in",
                      dataIndex: "checkin_date",
                      render: fmtDate,
                    },
                    {
                      title: "Check-out",
                      dataIndex: "checkout_date",
                      render: fmtDate,
                    },
                    {
                      title: "Số đêm",
                      dataIndex: "quantity_of_nights",
                    },
                    {
                      title: "Giá/đêm",
                      dataIndex: "price_per_night",
                      align: "right",
                      render: fmtVND,
                    },
                    {
                      title: "Tiền phòng",
                      dataIndex: "total_room_amount",
                      align: "right",
                      render: fmtVND,
                    },
                    {
                      title: "Tiền dịch vụ",
                      dataIndex: "total_service_amount",
                      align: "right",
                      render: (v) => fmtVND(v ?? 0),
                    },
                    {
                      title: "Tổng",
                      dataIndex: "total_amount",
                      align: "right",
                      render: (v) => <strong>{fmtVND(v)}</strong>,
                    },
                    {
                      title: "Trạng thái",
                      dataIndex: "status",
                      render: (v) => (
                        <Badge
                          color={STATUS_COLOR[v] ?? "default"}
                          text={STATUS_LABEL[v] ?? v}
                        />
                      ),
                    },
                  ]}
                  locale={{ emptyText: "Không có chi tiết phòng" }}
                />
              );
            },
            rowExpandable: (record) =>
              (record.booking_details?.length ?? 0) > 0,
          }}
          columns={[
            {
              title: "ID",
              dataIndex: "id",
              key: "id",
              width: 60,
            },
            {
              title: "Khách hàng",
              key: "customer",
              render: (_, r) => r.customer?.name ?? r.customer_id,
            },
            {
              title: "Ngày tạo",
              dataIndex: "created_at",
              key: "created_at",
              render: fmtDate,
            },
            {
              title: "Số phòng",
              key: "rooms",
              render: (_, r) => {
                const count = r.booking_details?.length ?? 0;
                return count > 0 ? (
                  <Badge count={count} color="#6366f1" />
                ) : (
                  "—"
                );
              },
            },
            {
              title: "Tổng tiền",
              key: "total",
              align: "right",
              render: (_, r) => {
                const total = r.booking_details?.reduce(
                  (s, d) => s + (d.total_amount ?? 0),
                  0,
                );
                return <strong>{fmtVND(total)}</strong>;
              },
            },
            {
              title: "Trạng thái phòng",
              key: "statuses",
              render: (_, r) => {
                const details = r.booking_details ?? [];
                if (!details.length) return "—";
                const unique = [...new Set(details.map((d) => d.status))];
                return (
                  <Space size={4} wrap>
                    {unique.map((s) => (
                      <Badge
                        key={s}
                        color={STATUS_COLOR[s] ?? "default"}
                        text={STATUS_LABEL[s] ?? s}
                        style={{ fontSize: 12 }}
                      />
                    ))}
                  </Space>
                );
              },
            },
            {
              title: "Thanh toán",
              dataIndex: "is_fully_paid",
              key: "is_fully_paid",
              render: (v) => (
                <Badge
                  color={v ? "green" : "orange"}
                  text={v ? "Đã thanh toán" : "Chưa thanh toán"}
                />
              ),
            },
            {
              title: "Ghi chú",
              dataIndex: "notes",
              key: "notes",
              render: (v) => v || "—",
              ellipsis: true,
            },
            {
              title: "Thao tác",
              key: "actions",
              render: (_, record) => (
                <Space>
                  <DetailModalTrigger id={record.id}>
                    <Tooltip title="Xem chi tiết">
                      <Button type="text" icon={<EyeOutlined />} />
                    </Tooltip>
                  </DetailModalTrigger>
                  <UpsertFormTrigger id={record.id}>
                    <Tooltip title="Chỉnh sửa">
                      <Button type="text" icon={<EditOutlined />} />
                    </Tooltip>
                  </UpsertFormTrigger>
                  <DeleteFormTrigger id={record.id}>
                    <Tooltip title="Xoá">
                      <Button danger type="text" icon={<DeleteOutlined />} />
                    </Tooltip>
                  </DeleteFormTrigger>
                </Space>
              ),
            },
          ]}
          rowKey="id"
          size="small"
          locale={{ emptyText: "Không có đặt phòng nào" }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} đặt phòng`,
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              setPageSize(newPageSize);
            },
          }}
        />
      </div>
    </div>
  );
}
