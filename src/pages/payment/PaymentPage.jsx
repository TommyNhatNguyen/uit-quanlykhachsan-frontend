import { PlusOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tag, Typography } from "antd";
import { useState } from "react";
import BookingDetailPicker from "../../components/BookingDetailPicker";
import EmployeePicker from "../../components/EmployeePicker";
import usePayments from "../../hooks/usePayments";
import { UpsertFormTrigger } from "./UpsertForm";

const METHOD_LABEL = {
  cash: "Tiền mặt",
  card: "Thẻ ngân hàng",
  transfer: "Chuyển khoản",
};
const METHOD_COLOR = {
  cash: "green",
  card: "blue",
  transfer: "purple",
};

const fmtVND = (v) =>
  typeof v === "number"
    ? v.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    : "—";

const fmtDate = (v) => (v ? new Date(v).toLocaleString("vi-VN") : "—");

export default function PaymentPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [bookingDetailId, setBookingDetailId] = useState(null);
  const [cashierId, setCashierId] = useState(null);

  const { isLoading, ...result } = usePayments({
    page,
    pageSize,
    bookingDetailId,
    cashierId,
  });
  const data = result.data?.data;
  const total = result.data?.total;

  const hasFilter = bookingDetailId !== null || cashierId !== null;

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div>
          <Typography.Title level={1}>Quản lý thanh toán</Typography.Title>
          <Typography.Text type="secondary">
            Danh sách các giao dịch thanh toán
          </Typography.Text>
        </div>
        <Space>
          <UpsertFormTrigger>
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm thanh toán
            </Button>
          </UpsertFormTrigger>
        </Space>
      </div>

      <div className="mb-3">
        <Space wrap>
          <Space>
            <Typography.Text type="secondary">
              Chi tiết đặt phòng:
            </Typography.Text>
            <BookingDetailPicker
              value={bookingDetailId}
              onChange={(v) => {
                setBookingDetailId(v ?? null);
                setPage(1);
              }}
              placeholder="Tất cả"
              style={{ minWidth: 280 }}
            />
          </Space>
          <Space>
            <Typography.Text type="secondary">Thu ngân:</Typography.Text>
            <EmployeePicker
              value={cashierId}
              onChange={(v) => {
                setCashierId(v ?? null);
                setPage(1);
              }}
              placeholder="Tất cả"
              style={{ minWidth: 180 }}
            />
          </Space>
          {hasFilter && (
            <Button
              size="small"
              onClick={() => {
                setBookingDetailId(null);
                setCashierId(null);
                setPage(1);
              }}
            >
              Xoá bộ lọc
            </Button>
          )}
        </Space>
      </div>

      <div>
        <Table
          loading={isLoading}
          dataSource={data}
          columns={[
            {
              title: "ID",
              dataIndex: "id",
              key: "id",
              width: 60,
            },
            {
              title: "Thu ngân",
              key: "cashier",
              render: (_, r) => r.cashier?.name ?? r.cashier_id,
            },
            {
              title: "Chi tiết đặt phòng",
              dataIndex: "booking_detail_id",
              key: "booking_detail_id",
              render: (v) => `#${v}`,
            },
            {
              title: "Phương thức",
              dataIndex: "payment_method",
              key: "payment_method",
              render: (v) => (
                <Tag color={METHOD_COLOR[v] ?? "default"}>
                  {METHOD_LABEL[v] ?? v}
                </Tag>
              ),
            },
            {
              title: "Số tiền",
              dataIndex: "total_payment",
              key: "total_payment",
              align: "right",
              render: (v) => <strong>{fmtVND(v)}</strong>,
            },
            {
              title: "Ngày thanh toán",
              dataIndex: "created_at",
              key: "created_at",
              render: fmtDate,
            },
            // {
            //   title: "Thao tác",
            //   key: "actions",
            //   render: (_, record) => (
            //     <Space>
            //       <UpsertFormTrigger id={record.id}>
            //         <Tooltip title="Chỉnh sửa">
            //           <Button type="text" icon={<EditOutlined />} />
            //         </Tooltip>
            //       </UpsertFormTrigger>
            //       <DeleteFormTrigger id={record.id}>
            //         <Tooltip title="Xoá">
            //           <Button danger type="text" icon={<DeleteOutlined />} />
            //         </Tooltip>
            //       </DeleteFormTrigger>
            //     </Space>
            //   ),
            // },
          ]}
          rowKey="id"
          size="small"
          locale={{ emptyText: "Không có giao dịch nào" }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} giao dịch`,
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
