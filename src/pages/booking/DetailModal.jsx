import { Badge, Descriptions, Divider, Modal, Table, Typography } from "antd";
import { useState } from "react";
import { useBookingDetail } from "../../hooks/useBookings";

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

const fmtVND = (v) =>
  typeof v === "number"
    ? v.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    : "—";
const fmtDate = (v) => (v ? new Date(v).toLocaleDateString("vi-VN") : "—");

export function DetailModalTrigger({ id, children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>
      {open && (
        <DetailModal id={id} open={open} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

function DetailModal({ id, open, onClose }) {
  const { data, isLoading } = useBookingDetail(id);

  const details = data?.booking_details ?? [];
  const grandTotal = details.reduce((s, d) => s + (d.total_amount ?? 0), 0);

  return (
    <Modal
      open={open}
      title={`Chi tiết đặt phòng #${id}`}
      onCancel={onClose}
      footer={null}
      width={900}
      loading={isLoading}
    >
      {data && (
        <>
          <Descriptions column={2} size="small" bordered>
            <Descriptions.Item label="Khách hàng">
              {data.customer?.name ?? data.customer_id}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {fmtDate(data.created_at)}
            </Descriptions.Item>
            <Descriptions.Item label="Thanh toán">
              <Badge
                color={data.is_fully_paid ? "green" : "orange"}
                text={data.is_fully_paid ? "Đã thanh toán đầy đủ" : "Chưa thanh toán đầy đủ"}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú">
              {data.notes || "—"}
            </Descriptions.Item>
          </Descriptions>

          <Divider style={{ margin: "16px 0 12px" }} />

          <Typography.Text strong>Danh sách phòng</Typography.Text>
          <Table
            style={{ marginTop: 8 }}
            dataSource={details}
            rowKey="id"
            size="small"
            pagination={false}
            locale={{ emptyText: "Không có chi tiết phòng" }}
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
                align: "center",
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
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={7} />
                <Table.Summary.Cell align="right">
                  <strong>{fmtVND(grandTotal)}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell />
              </Table.Summary.Row>
            )}
          />
        </>
      )}
    </Modal>
  );
}
