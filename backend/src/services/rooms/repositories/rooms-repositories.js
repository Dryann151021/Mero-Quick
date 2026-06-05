import pool from '../../../config/database.js';
import { nanoid } from 'nanoid';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import AuthorizationError from '../../../exceptions/authorization-error.js';

const RoomsRepositories = {
  addRoom: async (payload, ownerId) => {
    const id = `room-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    const query = {
      text: `INSERT INTO rooms 
        (id, name, location, address, capacity, price_per_hour, description, facilities, min_hours, open_time, close_time, type, owner_id, images, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING id`,
      values: [
        id,
        payload.name,
        payload.location,
        payload.address,
        payload.capacity,
        payload.price_per_hour,
        payload.description,
        JSON.stringify(payload.facilities),
        payload.min_hours,
        payload.open_time,
        payload.close_time,
        payload.type,
        ownerId,
        payload.images,
        createdAt,
        updatedAt,
      ],
    };

    const result = await pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan room');
    }
    return result.rows[0].id;
  },

  getRooms: async () => {
    const result = await pool.query('SELECT * FROM rooms');
    return result.rows.map((row) => ({
      ...row,
      facilities:
        typeof row.facilities === 'string'
          ? JSON.parse(row.facilities)
          : row.facilities,
    }));
  },

  getRoomById: async (id) => {
    const query = {
      text: 'SELECT * FROM rooms WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Room tidak ditemukan');
    }
    const row = result.rows[0];
    return {
      ...row,
      facilities:
        typeof row.facilities === 'string'
          ? JSON.parse(row.facilities)
          : row.facilities,
    };
  },

  editRoomById: async (id, payload) => {
    const updatedAt = new Date().toISOString();
    const query = {
      text: `UPDATE rooms SET 
        name = $1, location = $2, address = $3, capacity = $4, 
        price_per_hour = $5, description = $6, facilities = $7, 
        min_hours = $8, open_time = $9, close_time = $10, type = $11, 
        images = $12, updated_at = $13 
        WHERE id = $14 RETURNING id`,
      values: [
        payload.name,
        payload.location,
        payload.address,
        payload.capacity,
        payload.price_per_hour,
        payload.description,
        JSON.stringify(payload.facilities),
        payload.min_hours,
        payload.open_time,
        payload.close_time,
        payload.type,
        payload.images || null,
        updatedAt,
        id,
      ],
    };
    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui room. Id tidak ditemukan');
    }
  },

  deleteRoomById: async (id) => {
    const query = {
      text: 'DELETE FROM rooms WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Room gagal dihapus. Id tidak ditemukan');
    }
  },

  verifyRoomOwner: async (id, ownerId) => {
    const query = {
      text: 'SELECT owner_id FROM rooms WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Room tidak ditemukan');
    }
    const room = result.rows[0];
    if (room.owner_id !== ownerId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  },
};

export default RoomsRepositories;
