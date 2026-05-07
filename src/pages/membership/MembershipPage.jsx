import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tooltip, Typography } from "antd";
import { useState } from "react";
import useMembershipTypes from "../../hooks/useMembershipTypes";
import { DeleteFormTrigger } from "./DeleteForm";
import { UpsertFormTrigger } from "./UpsertForm";

export default function MembershipPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { isLoading, ...result } = useMembershipTypes({ page, pageSize });
  const data = result.data?.data;
  const total = result.data?.total;

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div>
          <Typography.Title level={1}>Hạng thành viên</Typography.Title>
          <Typography.Text type="secondary">
            Quản lý các hạng thành viên khách hàng
          </Typography.Text>
        </div>
        <Space>
          <UpsertFormTrigger>
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm hạng thành viên
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
              title: "Tên hạng thành viên",
              dataIndex: "name",
              key: "name",
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
          locale={{ emptyText: "Không có hạng thành viên nào" }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} hạng`,
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
