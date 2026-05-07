import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tag, Tooltip, Typography } from "antd";
import { useState } from "react";
import useEmployees from "../../hooks/useEmployees";
import { DeleteFormTrigger } from "./DeleteForm";
import { UpsertFormTrigger } from "./UpsertForm";

const ROLE_LABEL = {
  staff: "Nhân viên",
  admin: "Quản lý",
  accountant: "Kế toán",
};
const ROLE_COLOR = { staff: "default", admin: "blue", accountant: "green" };

export default function EmployeesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { isLoading, ...result } = useEmployees({ page, pageSize });
  const data = result.data?.data;
  const total = result.data?.total;

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div>
          <Typography.Title level={1}>Quản lý nhân viên</Typography.Title>
          <Typography.Text type="secondary">
            Danh sách nhân sự, vị trí và trạng thái làm việc
          </Typography.Text>
        </div>
        <Space>
          <UpsertFormTrigger>
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm nhân viên
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
              title: "Ngày sinh",
              dataIndex: "birthday",
              key: "birthday",
              render: (v) =>
                v ? new Date(v).toLocaleDateString("vi-VN") : "—",
            },
            {
              title: "Vị trí",
              dataIndex: "position",
              key: "position",
              render: (v) => v || "—",
            },
            {
              title: "Vai trò",
              dataIndex: "role",
              key: "role",
              render: (v) => (
                <Tag color={ROLE_COLOR[v]}>{ROLE_LABEL[v] ?? v}</Tag>
              ),
            },
            {
              title: "Ngày bắt đầu",
              dataIndex: "start_working_date",
              key: "start_working_date",
              render: (v) =>
                v ? new Date(v).toLocaleDateString("vi-VN") : "—",
            },
            {
              title: "Trạng thái",
              dataIndex: "is_working",
              key: "is_working",
              render: (v) => (
                <Tag color={v ? "green" : "default"}>
                  {v ? "Đang làm" : "Đã nghỉ"}
                </Tag>
              ),
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
          locale={{ emptyText: "Không có nhân viên nào" }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} nhân viên`,
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
