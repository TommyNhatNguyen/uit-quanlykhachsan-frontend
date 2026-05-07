import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";
import BookingsPage from "../../pages/BookingsPage";
import CustomersPage from "../../pages/CustomersPage";
import DashboardPage from "../../pages/DashboardPage";
import EmployeesPage from "../../pages/EmployeesPage";
import HotelPage from "../../pages/hotel/HotelPage";
import IntegrationPage from "../../pages/IntegrationPage";
import PaymentsPage from "../../pages/PaymentsPage";
import ReportsPage from "../../pages/ReportsPage";
import RoomsPage from "../../pages/room/room-list/RoomListPage";
import RoomPricePage from "../../pages/room/room-price/RoomPricePage";
import RoomTypePage from "../../pages/room/room-type/RoomTypePage";
import ServicesPage from "../../pages/ServicesPage";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Layout.Header
          style={{
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            padding: "0 24px",
            height: 56,
            lineHeight: "56px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Topbar />
        </Layout.Header>
        <Layout.Content
          style={{ padding: "24px 28px", maxWidth: 1400, width: "100%" }}
        >
          <Routes>
            <Route path="/hotel" element={<HotelPage />} />
            <Route path="/room-list" element={<RoomsPage />} />
            <Route path="/room-type" element={<RoomTypePage />} />
            <Route path="/room-price" element={<RoomPricePage />} />

            <Route path="/" element={<DashboardPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/integration" element={<IntegrationPage />} />
          </Routes>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
