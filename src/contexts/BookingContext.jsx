import { createContext, useContext } from 'react';
import BookingDetailModal from '../components/modals/BookingDetailModal';
import BookingFormModal from '../components/modals/BookingFormModal';
import { useBookings } from '../hooks/useBookings';
import { useAppStateContext } from './AppStateContext';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const { data, persist } = useAppStateContext();
  const bookings = useBookings(data, persist);
  return (
    <BookingContext.Provider value={bookings}>
      {children}
      <BookingFormModal
        open={bookings.formOpen}
        id={bookings.editingId}
        data={data}
        onClose={bookings.closeAll}
        onSubmit={bookings.submitBooking}
        prefillCustomerId={bookings.prefillCustomerId}
      />
      <BookingDetailModal
        open={bookings.detailOpen}
        booking={data.bookings.find((b) => b.id === bookings.viewingId)}
        onClose={bookings.closeAll}
        onEdit={(id) => { bookings.closeAll(); bookings.openForm(id); }}
        onChangeStatus={bookings.changeBookingStatus}
      />
    </BookingContext.Provider>
  );
}

export function useBookingContext() {
  return useContext(BookingContext);
}
