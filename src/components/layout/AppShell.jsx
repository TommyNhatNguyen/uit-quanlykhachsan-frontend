import { Layout, Spin } from 'antd';
import { Route, Routes } from 'react-router-dom';
import { useAppStateContext } from '../../contexts/AppStateContext';
import BookingsPage from '../../pages/BookingsPage';
import CustomersPage from '../../pages/CustomersPage';
import DashboardPage from '../../pages/DashboardPage';
import EmployeesPage from '../../pages/EmployeesPage';
import IntegrationPage from '../../pages/IntegrationPage';
import PaymentsPage from '../../pages/PaymentsPage';
import ReportsPage from '../../pages/ReportsPage';
import RoomsPage from '../../pages/RoomsPage';
import ServicesPage from '../../pages/ServicesPage';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppShell() {
  const { isLoading } = useAppStateContext();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Layout.Header
          style={{
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            padding: '0 24px',
            height: 56,
            lineHeight: '56px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Topbar />
        </Layout.Header>
        <Layout.Content style={{ padding: '24px 28px', maxWidth: 1400, width: '100%' }}>
          <Spin spinning={isLoading} size="large">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/integration" element={<IntegrationPage />} />
            </Routes>
          </Spin>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
