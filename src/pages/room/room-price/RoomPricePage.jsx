import { Space, Table, Tag, Typography } from "antd";
import { useState } from "react";
import RoomTypePicker from "../../../components/RoomTypePicker";
import useRooms, { useRoomHistoryPrices } from "../../../hooks/useRooms";

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

function RoomPriceHistory({ roomId }) {
  const { data, isLoading } = useRoomHistoryPrices(roomId);
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
          title: "Giá/đêm",
          dataIndex: "price_per_night",
          key: "price_per_night",
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

export default function RoomPricePage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [roomTypeId, setRoomTypeId] = useState(null);

  const { isLoading, ...result } = useRooms({ page, pageSize, roomTypeId });
  const data = result.data?.data;
  const total = result.data?.total;

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div>
          <Typography.Title level={1}>Lịch sử giá phòng</Typography.Title>
          <Typography.Text type="secondary">
            Xem giá hiện tại và lịch sử thay đổi giá từng phòng
          </Typography.Text>
        </div>
      </div>

      <div className="mb-3">
        <Space>
          <Typography.Text type="secondary">Loại phòng:</Typography.Text>
          <RoomTypePicker
            value={roomTypeId}
            onChange={(v) => {
              setRoomTypeId(v ?? null);
              setPage(1);
            }}
            placeholder="Tất cả"
            style={{ minWidth: 180 }}
          />
        </Space>
      </div>

      <Table
        loading={isLoading}
        dataSource={data}
        expandable={{
          expandedRowRender: (record) => (
            <RoomPriceHistory roomId={record.id} />
          ),
          rowExpandable: () => true,
        }}
        columns={[
          { title: "ID", dataIndex: "id", key: "id", width: 60 },
          {
            title: "Số phòng",
            dataIndex: "room_num",
            key: "room_num",
          },
          {
            title: "Tên phòng",
            dataIndex: "room_name",
            key: "room_name",
            render: (v) => v || "—",
          },
          {
            title: "Loại phòng",
            key: "room_type",
            render: (_, r) => r.room_type?.name ?? "—",
          },
          {
            title: "Giá/đêm hiện tại",
            dataIndex: "current_price_per_night",
            key: "current_price_per_night",
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
          showTotal: (t) => `Tổng ${t} phòng`,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          },
        }}
      />
    </div>
  );
}
