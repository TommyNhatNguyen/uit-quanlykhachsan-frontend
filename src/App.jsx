import { ConfigProvider, message } from 'antd';
import AppShell from './components/layout/AppShell';
import { AppStateProvider } from './contexts/AppStateContext';
import { BookingProvider } from './contexts/BookingContext';
import { CustomerProvider } from './contexts/CustomerContext';
import { RoomProvider } from './contexts/RoomContext';

message.config({ duration: 3.7 });

const theme = {
  token: {
    colorPrimary: '#6366f1',
    colorSuccess: '#22c55e',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    borderRadius: 8,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
};

export default function App() {
  return (
    <ConfigProvider theme={theme}>
      <AppStateProvider>
        <BookingProvider>
          <CustomerProvider>
            <RoomProvider>
              <AppShell />
            </RoomProvider>
          </CustomerProvider>
        </BookingProvider>
      </AppStateProvider>
    </ConfigProvider>
  );
}
