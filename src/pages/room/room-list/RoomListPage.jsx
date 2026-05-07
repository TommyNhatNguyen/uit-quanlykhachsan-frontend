import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Badge, Button, Slider, Space, Table, Tooltip, Typography } from "antd";
import { useState } from "react";
import RoomTypePicker from "../../../components/RoomTypePicker";
import useRooms from "../../../hooks/useRooms";
import { DeleteFormTrigger } from "./DeleteForm";
import { UpsertFormTrigger } from "./UpsertForm";

export default function RoomListPage() {
  const PRICE_MAX = 10000000;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [roomTypeId, setRoomTypeId] = useState(null);
  const [sliderRange, setSliderRange] = useState([0, PRICE_MAX]);
  const [priceFrom, setPriceFrom] = useState(null);
  const [priceTo, setPriceTo] = useState(null);
  const { isLoading, ...result } = useRooms({
    page,
    pageSize,
    roomTypeId,
    priceFrom,
    priceTo,
  });
  const data = result.data?.data;
  const total = result.data?.total;

  const handleRoomTypeFilter = (value) => {
    setRoomTypeId(value ?? null);
    setPage(1);
  };

  const handleSliderChange = (values) => setSliderRange(values);

  const handleSliderAfterChange = ([min, max]) => {
    setPriceFrom(min === 0 ? 0 : min);
    setPriceTo(max === PRICE_MAX ? null : max);
    setPage(1);
  };

  const hasFilter =
    roomTypeId !== null || sliderRange[0] > 0 || sliderRange[1] < PRICE_MAX;

  const resetFilters = () => {
    setRoomTypeId(null);
    setSliderRange([0, PRICE_MAX]);
    setPriceFrom(null);
    setPriceTo(null);
    setPage(1);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div>
          <Typography.Title level={1}>Quản lý phòng</Typography.Title>
          <Typography.Text type="secondary">
            Quản lý danh sách phòng khách sạn
          </Typography.Text>
        </div>
        <Space>
          <UpsertFormTrigger>
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm phòng
            </Button>
          </UpsertFormTrigger>
        </Space>
      </div>

      <div className="mb-3 flex flex-wrap items-end gap-4">
        <Space>
          <Typography.Text type="secondary">Loại phòng:</Typography.Text>
          <RoomTypePicker
            value={roomTypeId}
            onChange={handleRoomTypeFilter}
            placeholder="Tất cả"
            style={{ minWidth: 180 }}
          />
        </Space>
        <div style={{ minWidth: 280 }}>
          <div className="flex justify-between">
            <Typography.Text type="secondary">Giá/đêm:</Typography.Text>
            <Typography.Text type="secondary">
              {sliderRange[0].toLocaleString("vi-VN")}₫ —{" "}
              {sliderRange[1].toLocaleString("vi-VN")}₫
            </Typography.Text>
          </div>
          <Slider
            range
            min={0}
            max={PRICE_MAX}
            step={100_000}
            value={sliderRange}
            onChange={handleSliderChange}
            onChangeComplete={handleSliderAfterChange}
            tooltip={{ formatter: (v) => `${v.toLocaleString("vi-VN")}₫` }}
          />
        </div>
        <Button disabled={!hasFilter} onClick={resetFilters}>
          Xoá bộ lọc
        </Button>
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
            title: "Số phòng",
            dataIndex: "room_num",
            key: "room_num",
          },
          {
            title: "Tên phòng",
            dataIndex: "room_name",
            key: "room_name",
            render: (v) => v || "-",
          },
          {
            title: "Loại phòng",
            dataIndex: "room_type_id",
            key: "room_type_id",
            render: (_, record) => {
              return record?.room_type?.name || "-";
            },
          },
          {
            title: "Sức chứa",
            dataIndex: "capacity",
            key: "capacity",
            render: (v) => `${v} người`,
          },
          {
            title: "Diện tích",
            dataIndex: "area",
            key: "area",
            render: (v) => `${v} m²`,
          },
          {
            title: "Giá/đêm",
            dataIndex: "current_price_per_night",
            key: "current_price_per_night",
            render: (v) =>
              v?.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              }),
          },
          {
            title: "Trạng thái",
            key: "status",
            render: (_, record) => {
              if (record.is_deleted)
                return <Badge color="red" text="Không hoạt động" />;
              if (record.is_underconstruction)
                return <Badge color="orange" text="Đang thi công" />;
              return <Badge color="green" text="Hoạt động" />;
            },
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
        locale={{ emptyText: "Không có phòng nào" }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} phòng`,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          },
        }}
      />
    </div>
  );
}
