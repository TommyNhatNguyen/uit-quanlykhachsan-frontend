import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tooltip, Typography } from "antd";
import { useState } from "react";
import useCustomers from "../../hooks/useCustomers";
import { DeleteFormTrigger } from "./DeleteForm";
import { UpsertFormTrigger } from "./UpsertForm";

const SEX_LABEL = { 1: "Nam", 2: "Nữ", 3: "Khác" };

export default function CustomerPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { isLoading, ...result } = useCustomers({ page, pageSize });
  const data = result.data?.data;
  const total = result.data?.total;

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div>
          <Typography.Title level={1}>Quản lý khách hàng</Typography.Title>
          <Typography.Text type="secondary">
            Danh sách khách hàng
          </Typography.Text>
        </div>
        <Space>
          <UpsertFormTrigger>
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm khách hàng
            </Button>
          </UpsertFormTrigger>
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
              title: "Họ tên",
              dataIndex: "name",
              key: "name",
            },
            {
              title: "SĐT",
              dataIndex: "phone",
              key: "phone",
            },
            {
              title: "Giới tính",
              dataIndex: "sex",
              key: "sex",
              render: (v) => SEX_LABEL[v] ?? "—",
            },
            {
              title: "CCCD / Hộ chiếu",
              dataIndex: "identification_id",
              key: "identification_id",
            },
            {
              title: "Email",
              dataIndex: "email",
              key: "email",
              render: (v) => v || "—",
            },
            {
              title: "Ngày sinh",
              dataIndex: "birthday",
              key: "birthday",
              render: (v) =>
                v ? new Date(v).toLocaleDateString("vi-VN") : "—",
            },
            {
              title: "Hạng thành viên",
              key: "membership",
              render: (_, record) => record.membership_type?.name ?? "—",
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
          locale={{ emptyText: "Không có khách hàng nào" }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} khách hàng`,
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
