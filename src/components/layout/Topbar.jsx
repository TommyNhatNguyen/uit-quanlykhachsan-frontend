import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Space, Typography } from "antd";
import { useAuth } from "../../contexts/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
      <Space>
        <Avatar icon={<UserOutlined />} size="small" />
        <Typography.Text strong>{user?.name}</Typography.Text>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={logout}
          title="Đăng xuất"
        >
          Đăng xuất
        </Button>
      </Space>
    </div>
  );
}
