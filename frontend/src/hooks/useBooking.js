import { useState } from 'react';
import { calcBookingDuration } from '../utils/formatters';
import { createBooking } from '../api/bookings';
export function useBooking(room) {
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  function computePrice(startDate, startTime, endDate, endTime) {
    if (!room) return 0;
    const hours = calcBookingDuration(startDate, startTime, endDate, endTime);
    return Math.max(0, hours) * room.pricePerHour;
  }
  async function submitBooking(payload) {
    if (!room) return false;
    const hours = calcBookingDuration(
      payload.startDate,
      payload.startTime,
      payload.endDate,
      payload.endTime,
    );
    if (hours < room.minHours) {
      setErrorMsg(`Minimum pemesanan ${room.minHours} jam`);
      return false;
    }
    if (hours <= 0) {
      setErrorMsg('Waktu selesai harus setelah waktu mulai');
      return false;
    }
    setStatus('loading');
    setErrorMsg('');

    try {
      await createBooking({
        roomId: room.id,
        startDate: payload.startDate,
        endDate: payload.endDate,
        startTime: payload.startTime,
        endTime: payload.endTime,
        activity: payload.activity,
        organization: payload.organization,
      });
      setStatus('success');
      return true;
    } catch (err) {
      console.error('Booking error:', err);
      setErrorMsg(
        err.response?.data?.message || err.message || 'Gagal membuat pesanan',
      );
      setStatus('idle');
      return false;
    }
  }
  function reset() {
    setStatus('idle');
    setErrorMsg('');
  }
  return { status, errorMsg, computePrice, submitBooking, reset };
}
