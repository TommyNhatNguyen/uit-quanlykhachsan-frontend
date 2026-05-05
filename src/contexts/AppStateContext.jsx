import { createContext, useContext } from 'react';
import { useAppState } from '../hooks/useAppState';

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const value = useAppState();
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppStateContext() {
  return useContext(AppStateContext);
}
