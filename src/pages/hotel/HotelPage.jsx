import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Badge, Button, Space, Table, Tooltip, Typography } from "antd";
import { useState } from "react";
import useHotels from "../../hooks/useHotels";
import { DeleteFormTrigger } from "./DeleteForm";
import { UpsertFormTrigger } from "./UpsertForm";

export default function HotelPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { isLoading, ...result } = useHotels({ page, pageSize });
  const data = result.data?.data;
  const total = result.data?.total;

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div>
          <Typography.Title level={1}>Quản lý chi nhánh</Typography.Title>
          <Typography.Text type="secondary">
            Quản lý chi nhánh khách sạn
          </Typography.Text>
        </div>
        <Space>
          <UpsertFormTrigger>
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm chi nhánh
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
              render: (text) => <Typography.Text>{text}</Typography.Text>,
            },
            {
              title: "Tên chi nhánh",
              dataIndex: "name",
              key: "name",
              render: (text) => <Typography.Text>{text}</Typography.Text>,
            },
            {
              title: "Số điện thoại",
              dataIndex: "phone",
              key: "phone",
              render: (text) => <Typography.Text>{text}</Typography.Text>,
            },
            {
              title: "Địa chỉ",
              dataIndex: "address",
              key: "address",
              render: (text) => <Typography.Text>{text}</Typography.Text>,
            },
            {
              title: "Trạng thái",
              dataIndex: "is_deleted",
              key: "is_deleted",
              render: (text) => (
                <Badge
                  color={text ? "red" : "green"}
                  text={text ? "Không hoạt động" : "Hoạt động"}
                />
              ),
            },
            {
              title: "Thao tác",
              dataIndex: "actions",
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
          locale={{ emptyText: "Không có chi nhánh nào" }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} chi nhánh`,
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
