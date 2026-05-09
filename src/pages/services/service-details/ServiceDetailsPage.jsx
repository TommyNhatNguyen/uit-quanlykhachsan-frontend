import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tooltip, Typography } from "antd";
import { useState } from "react";
import BookingDetailPicker from "../../../components/BookingDetailPicker";
import ServicePicker from "../../../components/ServicePicker";
import useServiceDetails from "../../../hooks/useServiceDetails";
import { DeleteFormTrigger } from "./DeleteForm";
import { UpsertFormTrigger } from "./UpsertForm";

const fmtVND = (v) =>
  typeof v === "number"
    ? v.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    : "—";

export default function ServiceDetailsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [serviceId, setServiceId] = useState(null);
  const [bookingDetailId, setBookingDetailId] = useState(null);

  const { isLoading, ...result } = useServiceDetails({
    page,
    pageSize,
    serviceId,
    bookingDetailId,
  });
  const data = result.data?.data;
  const total = result.data?.total;

  const hasFilter = serviceId !== null || bookingDetailId !== null;

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div>
          <Typography.Title level={1}>Sử dụng dịch vụ</Typography.Title>
          <Typography.Text type="secondary">
            Danh sách dịch vụ đã sử dụng theo đặt phòng
          </Typography.Text>
        </div>
        <Space>
          <UpsertFormTrigger>
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm
            </Button>
          </UpsertFormTrigger>
        </Space>
      </div>

      <div className="mb-3">
        <Space wrap>
          <Space>
            <Typography.Text type="secondary">Dịch vụ:</Typography.Text>
            <ServicePicker
              value={serviceId}
              onChange={(v) => { setServiceId(v ?? null); setPage(1); }}
              placeholder="Tất cả"
              style={{ minWidth: 200 }}
            />
          </Space>
          <Space>
            <Typography.Text type="secondary">Chi tiết đặt phòng:</Typography.Text>
            <BookingDetailPicker
              value={bookingDetailId}
              onChange={(v) => { setBookingDetailId(v ?? null); setPage(1); }}
              placeholder="Tất cả"
              style={{ minWidth: 280 }}
            />
          </Space>
          {hasFilter && (
            <Button
              size="small"
              onClick={() => { setServiceId(null); setBookingDetailId(null); setPage(1); }}
            >
              Xoá bộ lọc
            </Button>
          )}
        </Space>
      </div>

      <Table
        loading={isLoading}
        dataSource={data}
        columns={[
          { title: "ID", dataIndex: "id", key: "id", width: 60 },
          {
            title: "Chi tiết đặt phòng",
            dataIndex: "booking_detail_id",
            key: "booking_detail_id",
            render: (v) => `#${v}`,
          },
          {
            title: "Dịch vụ",
            key: "service",
            render: (_, r) => r.service?.name ?? `#${r.service_id}`,
          },
          {
            title: "Số lượng",
            dataIndex: "quanity",
            key: "quanity",
            align: "center",
          },
          {
            title: "Đơn giá",
            dataIndex: "price",
            key: "price",
            align: "right",
            render: (v) => fmtVND(v),
          },
          {
            title: "Thành tiền",
            dataIndex: "total_amount",
            key: "total_amount",
            align: "right",
            render: (v) => <strong>{fmtVND(v)}</strong>,
          },
          {
            title: "Thao tác",
            key: "actions",
            render: (_, record) => (
              <Space>
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
