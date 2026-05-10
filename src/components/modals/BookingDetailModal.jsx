import { Button, Descriptions, Modal, Space, Tag, Typography } from "antd";
import React from "react";
import { paymentMap, statusMap } from "../../constants";
import { fmtDate, fmtVND } from "../../utils";

export default function BookingDetailModal({
  open,
  booking,
  onClose,
  onEdit,
  onChangeStatus,
}) {
  if (!booking) return null;
  const s = statusMap[booking.status];
  const p = paymentMap[booking.payment];
  const nights = Math.max(
    1,
    Math.round(
      (new Date(booking.checkout) - new Date(booking.checkin)) / 86400000,
    ),
  );

  const footer = (
    <Space>
      <Button onClick={onClose}>Đóng</Button>
      <Button
        onClick={() => {
          onClose();
          onEdit(booking.id);
        }}
      >
        Sửa
      </Button>
      {booking.status === "pending" && (
        <Button
          type="primary"
          onClick={() => {
            onChangeStatus(booking.id, "confirmed");
            onClose();
          }}
        >
          Xác nhận
        </Button>
      )}
      {booking.status === "confirmed" && (
        <Button
          type="primary"
          onClick={() => {
            onChangeStatus(booking.id, "checked_in");
            onClose();
          }}
        >
          Check-in
        </Button>
      )}
      {booking.status === "checked_in" && (
        <Button
          type="primary"
          onClick={() => {
            onChangeStatus(booking.id, "checked_out");
            onClose();
          }}
        >
          Check-out
        </Button>
      )}
    </Space>
  );

  return (
    <Modal
      open={open}
      title="Chi tiết booking"
      onCancel={onClose}
      footer={footer}
      width={760}
      destroyOnHidden
    >
      <Space style={{ marginBottom: 16 }}>
        <Typography.Text strong style={{ fontSize: 16 }}>
          #{booking.id}
        </Typography.Text>
        <Tag color={s.color}>{s.label}</Tag>
        <Tag color={p.color}>{p.label}</Tag>
      </Space>
      <Descriptions column={2} size="small" bordered>
        <Descriptions.Item label="Khách hàng">
          {booking.customer}
        </Descriptions.Item>
        <Descriptions.Item label="Phòng">{booking.rooms}</Descriptions.Item>
        <Descriptions.Item label="Check-in">
          {fmtDate(booking.checkin)}
        </Descriptions.Item>
        <Descriptions.Item label="Check-out">
          {fmtDate(booking.checkout)}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">
          {fmtVND(booking.amount)} ₫
        </Descriptions.Item>
        <Descriptions.Item label="Số đêm">{nights}</Descriptions.Item>
      </Descriptions>
      {booking.notes && (
        <div
          style={{
            marginTop: 14,
            padding: 12,
            background: "#fafbfc",
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          <strong>Ghi chú:</strong> {booking.notes}
        </div>
      )}
    </Modal>
  );
}
