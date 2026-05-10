import {
  DeleteOutlined,
  DollarCircleOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Input, Space, Table, Tooltip, Typography } from "antd";
import { useState } from "react";
import useServiceItems from "../../../hooks/useServiceItems";
import { DeleteFormTrigger } from "./DeleteForm";
import { UpdatePriceFormTrigger } from "./UpdatePriceForm";
import { UpsertFormTrigger } from "./UpsertForm";

const fmtVND = (v) =>
  typeof v === "number"
    ? v.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    : "—";

export default function ServiceListPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const { isLoading, ...result } = useServiceItems({ page, pageSize });
  const allData = result.data?.data ?? [];
  const total = result.data?.total;

  const data = search
    ? allData.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          (s.catalog ?? "").toLowerCase().includes(search.toLowerCase()),
      )
    : allData;

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div>
          <Typography.Title level={1}>Quản lý dịch vụ</Typography.Title>
          <Typography.Text type="secondary">
            Danh sách các dịch vụ khách sạn
          </Typography.Text>
        </div>
        <Space>
          <UpsertFormTrigger>
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm dịch vụ
            </Button>
          </UpsertFormTrigger>
        </Space>
      </div>

      <div className="mb-3">
        <Input.Search
          placeholder="Tìm theo tên hoặc danh mục..."
          allowClear
          style={{ maxWidth: 320 }}
          onSearch={(v) => { setSearch(v); setPage(1); }}
          onChange={(e) => { if (!e.target.value) setSearch(""); }}
        />
      </div>

      <Table
        loading={isLoading}
        dataSource={data}
        columns={[
          { title: "ID", dataIndex: "id", key: "id", width: 60 },
          { title: "Tên dịch vụ", dataIndex: "name", key: "name" },
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
            render: (v) => <strong>{fmtVND(v)}</strong>,
          },
          {
            title: "Thao tác",
            key: "actions",
            render: (_, record) => (
              <Space>
                <UpdatePriceFormTrigger id={record.id}>
                  <Tooltip title="Cập nhật giá">
                    <Button type="text" icon={<DollarCircleOutlined />} />
                  </Tooltip>
                </UpdatePriceFormTrigger>
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
        locale={{ emptyText: "Không có dịch vụ nào" }}
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
