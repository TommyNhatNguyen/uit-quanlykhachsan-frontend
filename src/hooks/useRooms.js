import { message, Modal } from 'antd';
import { useState } from 'react';
import { TODAY } from '../constants';

export function useRooms(data, persist) {
  const [roomFormOpen, setRoomFormOpen] = useState(false);
  const [priceFormOpen, setPriceFormOpen] = useState(false);
  const [editingRoomNumber, setEditingRoomNumber] = useState(null);

  const openRoomForm = (number = null) => { setEditingRoomNumber(number); setRoomFormOpen(true); };
  const openPriceForm = () => setPriceFormOpen(true);
  const closeAll = () => { setRoomFormOpen(false); setPriceFormOpen(false); setEditingRoomNumber(null); };

  const submitRoom = (formData) => {
    const payload = {
      number: formData.number.trim(),
      type: formData.type,
      price: +formData.price,
      capacity: formData.capacity,
      area: formData.area || '—',
      smoking: formData.smoking === 'true',
      status: formData.status,
    };
    if (formData.number_old) {
      if (payload.number !== formData.number_old && data.rooms.some(r => r.number === payload.number)) {
        message.error('Số phòng đã tồn tại'); return;
      }
      persist({ ...data, rooms: data.rooms.map(r => r.number === formData.number_old ? payload : r) });
      message.success(`Đã cập nhật phòng ${payload.number}`);
    } else {
      if (data.rooms.some(r => r.number === payload.number)) {
        message.error('Số phòng đã tồn tại'); return;
      }
      persist({ ...data, rooms: [...data.rooms, payload] });
      message.success(`Đã thêm phòng ${payload.number}`);
    }
    closeAll();
  };

  const deleteRoom = (number) => {
    Modal.confirm({
      title: 'Xoá phòng',
      content: `Xoá phòng ${number}?`,
      okText: 'Xoá', okButtonProps: { danger: true },
      cancelText: 'Huỷ',
      onOk: () => {
        persist({ ...data, rooms: data.rooms.filter(r => r.number !== number) });
        message.success(`Đã xoá phòng ${number}`);
        closeAll();
      },
    });
  };

  const submitPrice = (formData) => {
    const newLog = {
      id: data.counters.price,
      roomNumber: formData.roomNumber,
      from: formData.from,
      to: formData.to || null,
      price: +formData.price,
    };
    const newRooms = data.rooms.map(r => {
      if (r.number !== formData.roomNumber) return r;
      if (!formData.to || formData.to >= TODAY) return { ...r, price: +formData.price };
      return r;
    });
    persist({ ...data, priceLogs: [...data.priceLogs, newLog], rooms: newRooms, counters: { ...data.counters, price: data.counters.price + 1 } });
    message.success(`Đã áp giá mới cho phòng ${formData.roomNumber}`);
    closeAll();
  };

  return { roomFormOpen, priceFormOpen, editingRoomNumber, openRoomForm, openPriceForm, closeAll, submitRoom, deleteRoom, submitPrice };
}
