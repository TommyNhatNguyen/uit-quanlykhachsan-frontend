import { Space, Table, Typography } from "antd";
import { useState } from "react";
import RoomPicker from "../../../components/RoomPicker";
import useRoomPriceLogs from "../../../hooks/useRoomPriceLogs";

export default function RoomPricePage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [roomId, setRoomId] = useState(null);

  const { isLoading, ...result } = useRoomPriceLogs({ page, pageSize, roomId });
  const data = result.data?.data;
  const total = result.data?.total;

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div>
          <Typography.Title level={1}>Lịch sử giá phòng</Typography.Title>
          <Typography.Text type="secondary">
            Xem lịch sử thay đổi giá phòng
          </Typography.Text>
        </div>
      </div>

      <div className="mb-3">
        <Space>
          <Typography.Text type="secondary">Lọc theo phòng:</Typography.Text>
          <RoomPicker
            value={roomId}
            onChange={(v) => { setRoomId(v ?? null); setPage(1); }}
            placeholder="Tất cả phòng"
            style={{ minWidth: 220 }}
          />
        </Space>
      </div>

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
            title: "Phòng",
            key: "room",
            render: (_, record) =>
              `#${record?.room?.id} - ${record?.room?.room_num} - ${record?.room?.room_name}`,
          },
          {
            title: "Giá/đêm",
            dataIndex: "price_per_night",
            key: "price_per_night",
            render: (v) =>
              v?.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              }),
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
          showTotal: (total) => `Tổng ${total} bản ghi`,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          },
        }}
      />
    </div>
  );
}
