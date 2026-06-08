import BookingsRepositories from '../repositories/bookings-repositories.js';
import RoomsRepositories from '../../rooms/repositories/rooms-repositories.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import response from '../../../utils/response.js';

export const addBooking = async (c) => {
  const payload = c.get('validated');
  const user = c.get('user');

  // Verify room exists
  await RoomsRepositories.getRoomById(payload.room_id);

  // Check time availability (only against accepted bookings)
  const isAvailable = await BookingsRepositories.checkAvailability(
    payload.room_id,
    payload.start_date,
    payload.start_time,
    payload.end_date,
    payload.end_time
  );

  if (!isAvailable) {
    throw new InvariantError(
      'Ruangan sudah dipesan pada tanggal dan jam tersebut'
    );
  }

  const bookingId = await BookingsRepositories.addBooking(payload, user.id);

  return response(c, 201, 'Booking berhasil dibuat', { bookingId });
};

export const getMyBookings = async (c) => {
  const user = c.get('user');

  const currentBookings = await BookingsRepositories.getUserCurrentBookings(
    user.id
  );
  const historyBookings = await BookingsRepositories.getUserHistoryBookings(
    user.id
  );

  return response(c, 200, 'Berhasil mendapatkan data bookings', {
    currentBookings,
    historyBookings,
  });
};

export const getAdminBookings = async (c) => {
  const currentBookings = await BookingsRepositories.getAdminCurrentBookings();
  const historyBookings = await BookingsRepositories.getAdminHistoryBookings();

  return response(c, 200, 'Berhasil mendapatkan data bookings', {
    currentBookings,
    historyBookings,
  });
};

export const updateBookingStatus = async (c) => {
  const bookingId = c.req.param('id');
  const { status } = await c.req.json();

  const validStatuses = ['accepted', 'rejected'];
  if (!validStatuses.includes(status)) {
    throw new InvariantError('Status harus accepted atau rejected');
  }

  await BookingsRepositories.updateBookingStatus(bookingId, status);

  return response(c, 200, `Booking berhasil di-${status}`);
};
