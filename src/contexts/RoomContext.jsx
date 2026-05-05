import { createContext, useContext } from 'react';
import PriceFormModal from '../components/modals/PriceFormModal';
import RoomFormModal from '../components/modals/RoomFormModal';
import { useRooms } from '../hooks/useRooms';
import { useAppStateContext } from './AppStateContext';

const RoomContext = createContext(null);

export function RoomProvider({ children }) {
  const { data, persist } = useAppStateContext();
  const rooms = useRooms(data, persist);
  return (
    <RoomContext.Provider value={rooms}>
      {children}
      <RoomFormModal
        open={rooms.roomFormOpen}
        roomNumber={rooms.editingRoomNumber}
        data={data}
        onClose={rooms.closeAll}
        onSubmit={rooms.submitRoom}
        onDelete={rooms.deleteRoom}
      />
      <PriceFormModal
        open={rooms.priceFormOpen}
        data={data}
        onClose={rooms.closeAll}
        onSubmit={rooms.submitPrice}
      />
    </RoomContext.Provider>
  );
}

export function useRoomContext() {
  return useContext(RoomContext);
}
