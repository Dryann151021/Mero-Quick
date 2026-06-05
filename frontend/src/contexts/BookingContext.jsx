import React, { createContext, useContext, useState } from 'react';
import { formatInputDate } from '../utils/formatters';
function getDateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatInputDate(date);
}
const defaultBooking = {
  room: null,
  date: formatInputDate(new Date()),
  startTime: '09:00',
  endTime: '11:00',
  notes: '',
};
const initialBookings = [
  {
    id: 'b1',
    roomId: '1',
    roomName: 'Ruang Meeting Cilanda',
    roomType: 'meeting',
    city: 'Jakarta Selatan',
    date: formatInputDate(new Date()),
    startTime: '09:00',
    endTime: '11:00',
    notes: 'Presentasi tim pemasaran',
    bookedAt: new Date().toISOString(),
  },
  {
    id: 'b2',
    roomId: '2',
    roomName: 'Ruang Event Grand Ballroom',
    roomType: 'event',
    city: 'Jakarta Pusat',
    date: getDateOffset(1),
    startTime: '14:00',
    endTime: '18:00',
    notes: 'Gathering klien',
    bookedAt: new Date().toISOString(),
  },
  {
    id: 'b3',
    roomId: '3',
    roomName: 'Focus Room Kemang',
    roomType: 'meeting',
    city: 'Jakarta Selatan',
    date: getDateOffset(2),
    startTime: '10:00',
    endTime: '12:00',
    notes: 'Interview kandidat',
    bookedAt: new Date().toISOString(),
  },
];
const BookingContext = createContext(null);
export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(defaultBooking);
  const [bookings, setBookings] = useState(initialBookings);
  const setRoom = (room) => setBooking((b) => ({ ...b, room }));
  const setDate = (date) => setBooking((b) => ({ ...b, date }));
  const setStartTime = (startTime) => setBooking((b) => ({ ...b, startTime }));
  const setEndTime = (endTime) => setBooking((b) => ({ ...b, endTime }));
  const setNotes = (notes) => setBooking((b) => ({ ...b, notes }));
  const resetBooking = () => setBooking(defaultBooking);
  const addBooking = (bookingEntry) =>
    setBookings((prev) => [bookingEntry, ...prev]);
  return (
    <BookingContext.Provider
      value={{
        booking,
        bookings,
        setRoom,
        setDate,
        setStartTime,
        setEndTime,
        setNotes,
        resetBooking,
        addBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}
export function useBookingContext() {
  const ctx = useContext(BookingContext);
  if (!ctx)
    throw new Error('useBookingContext must be used inside BookingProvider');
  return ctx;
}
