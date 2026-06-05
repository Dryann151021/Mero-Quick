import RoomsRepositories from '../repositories/rooms-repositories.js';
import BookingsRepositories from '../../bookings/repositories/bookings-repositories.js';
import response from '../../../utils/response.js';

const maskEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  const [localPart, domain] = email.split('@');
  if (!domain) return email;
  if (localPart.length <= 2) {
    return `${localPart[0]}*@${domain}`;
  }
  return `${localPart.substring(0, 2)}****@${domain}`;
};

export const addRoom = async (c) => {
  const payload = c.get('validated');
  const user = c.get('user');

  const roomId = await RoomsRepositories.addRoom(payload, user.id);

  return response(c, 201, 'Room berhasil ditambahkan', { roomId });
};

export const getRooms = async (c) => {
  const rooms = await RoomsRepositories.getRooms();
  return response(c, 200, 'Berhasil mendapatkan data rooms', { rooms });
};

export const getRoomById = async (c) => {
  const id = c.req.param('id');
  const room = await RoomsRepositories.getRoomById(id);
  const rawBookings = await BookingsRepositories.getBookingsByRoomId(id);

  /* eslint-disable camelcase */
  const bookings = rawBookings.map((b) => ({
    id: b.id,
    booking_date: b.booking_date,
    start_time: b.start_time,
    end_time: b.end_time,
    activity: b.activity,
    organization: b.organization,
    user_email: maskEmail(b.user_email),
  }));
  /* eslint-enable camelcase */

  return response(c, 200, 'Berhasil mendapatkan data room', {
    room: {
      ...room,
      bookings,
    },
  });
};

export const editRoomById = async (c) => {
  const id = c.req.param('id');
  const payload = c.get('validated');
  const user = c.get('user');

  await RoomsRepositories.verifyRoomOwner(id, user.id);
  await RoomsRepositories.editRoomById(id, payload);

  return response(c, 200, 'Room berhasil diperbarui');
};

export const deleteRoomById = async (c) => {
  const id = c.req.param('id');
  const user = c.get('user');

  await RoomsRepositories.verifyRoomOwner(id, user.id);
  await RoomsRepositories.deleteRoomById(id);

  return response(c, 200, 'Room berhasil dihapus');
};
