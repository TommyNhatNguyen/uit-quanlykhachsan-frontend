import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";
import BookingsPage from "../../pages/booking/BookingsPage";
import CustomerPage from "../../pages/customer/CustomerPage";
import DashboardPage from "../../pages/dashboard/DashboardPage";
import EmployeesPage from "../../pages/employee/EmployeesPage";
import HotelPage from "../../pages/hotel/HotelPage";
import MembershipPage from "../../pages/membership/MembershipPage";
import PaymentPage from "../../pages/payment/PaymentPage";
import RoomsPage from "../../pages/room/room-list/RoomListPage";
import RoomPricePage from "../../pages/room/room-price/RoomPricePage";
import RoomTypePage from "../../pages/room/room-type/RoomTypePage";
import ServiceDetailsPage from "../../pages/services/service-details/ServiceDetailsPage";
import ServiceListPage from "../../pages/services/service-list/ServiceListPage";
import ServicePriceLogPage from "../../pages/services/service-price-log/ServicePriceLogPage";
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
            <Route path="/customers" element={<CustomerPage />} />
            <Route path="/membership" element={<MembershipPage />} />

            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/services" element={<ServiceListPage />} />
            <Route path="/service-details" element={<ServiceDetailsPage />} />
            <Route
              path="/service-price-log"
              element={<ServicePriceLogPage />}
            />
            <Route path="/payments" element={<PaymentPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
          </Routes>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
