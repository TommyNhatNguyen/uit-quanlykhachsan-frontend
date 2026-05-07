import { ConfigProvider, message } from "antd";
import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import "./index.css";
import LoginPage from "./pages/auth/LoginPage";

message.config({ duration: 3.7 });

const theme = {
  token: {
    colorPrimary: "#6366f1",
    colorSuccess: "#22c55e",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",
    borderRadius: 8,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
};

function ProtectedRoute() {
  const { user } = useAuth();
  return user ? <AppShell /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <ConfigProvider theme={theme}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<ProtectedRoute />} />
        </Routes>
      </AuthProvider>
    </ConfigProvider>
  );
}
