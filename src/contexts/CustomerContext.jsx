import { createContext, useContext } from 'react';
import CustomerDetailModal from '../components/modals/CustomerDetailModal';
import CustomerFormModal from '../components/modals/CustomerFormModal';
import { useCustomers } from '../hooks/useCustomers';
import { useAppStateContext } from './AppStateContext';
import { useBookingContext } from './BookingContext';

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const { data, persist } = useAppStateContext();
  const { openForm: openBookingForm } = useBookingContext();
  const customers = useCustomers(data, persist);
  customers.openBookingForm = (customerId) => openBookingForm(null, customerId);
  return (
    <CustomerContext.Provider value={customers}>
      {children}
      <CustomerFormModal
        open={customers.formOpen}
        id={customers.editingId}
        data={data}
        onClose={customers.closeAll}
        onSubmit={customers.submitCustomer}
      />
      <CustomerDetailModal
        open={customers.detailOpen}
        customer={data.customers.find((c) => c.id === customers.viewingId)}
        data={data}
        onClose={customers.closeAll}
        onEdit={(id) => { customers.closeAll(); customers.openForm(id); }}
      />
    </CustomerContext.Provider>
  );
}

export function useCustomerContext() {
  return useContext(CustomerContext);
}
