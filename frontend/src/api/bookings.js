import { apiClient } from './client';

export async function createBooking(payload) {
  return apiClient('/bookings', {
    method: 'POST',
    data: {
      room_id: payload.roomId,
      booking_date: payload.date,
      start_time: payload.startTime,
      end_time: payload.endTime,
      activity: payload.activity,
      organization: payload.organization,
    },
  });
}

export async function getMyBookings() {
  const res = await apiClient('/bookings/my-bookings');
  return res.data;
}

export async function getAdminBookings() {
  const res = await apiClient('/bookings/admin');
  return res.data;
}

export async function updateBookingStatus(bookingId, status) {
  return apiClient(`/bookings/${bookingId}/status`, {
    method: 'PATCH',
    data: { status },
  });
}
