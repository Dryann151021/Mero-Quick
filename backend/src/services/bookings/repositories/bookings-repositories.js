import pool from '../../../config/database.js';
import { nanoid } from 'nanoid';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';

const BookingsRepositories = {
  addBooking: async (payload, userId) => {
    const id = `booking-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: `INSERT INTO bookings 
        (id, room_id, user_id, booking_date, start_date, end_date, start_time, end_time, activity, organization, status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id`,
      values: [
        id,
        payload.room_id,
        userId,
        payload.start_date,
        payload.start_date,
        payload.end_date,
        payload.start_time,
        payload.end_time,
        payload.activity,
        payload.organization,
        'pending',
        createdAt,
      ],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan booking');
    }

    return result.rows[0].id;
  },

  checkAvailability: async (roomId, startDate, startTime, endDate, endTime) => {
    const query = {
      text: `SELECT id FROM bookings 
        WHERE room_id = $1 
          AND status = 'accepted'
          AND (start_date || ' ' || start_time)::timestamp < ($4 || ' ' || $5)::timestamp
          AND (end_date || ' ' || end_time)::timestamp > ($2 || ' ' || $3)::timestamp`,
      values: [roomId, startDate, startTime, endDate, endTime],
    };

    const result = await pool.query(query);
    return result.rows.length === 0;
  },

  getBookingsByRoomId: async (roomId) => {
    const query = {
      text: `SELECT 
        b.id,
        b.booking_date,
        b.start_date,
        b.end_date,
        b.start_time,
        b.end_time,
        b.activity,
        b.organization,
        b.status,
        u.email as user_email
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE b.room_id = $1 AND b.status = 'accepted'
      ORDER BY b.start_date ASC, b.start_time ASC`,
      values: [roomId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  getUserCurrentBookings: async (userId) => {
    const query = {
      text: `SELECT 
        b.id, b.booking_date, b.start_date, b.end_date, b.start_time, b.end_time,
        b.activity, b.organization, b.status, b.created_at,
        r.name as room_name, r.location as room_location
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE b.user_id = $1
        AND (
          b.status = 'pending'
          OR (
            b.status = 'accepted'
            AND (b.end_date || ' ' || b.end_time)::timestamp >= NOW()
          )
        )
      ORDER BY b.start_date ASC, b.start_time ASC`,
      values: [userId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  getUserHistoryBookings: async (userId) => {
    const query = {
      text: `SELECT 
        b.id, b.booking_date, b.start_date, b.end_date, b.start_time, b.end_time,
        b.activity, b.organization, b.status, b.created_at,
        r.name as room_name, r.location as room_location
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE b.user_id = $1
        AND (
          b.status = 'rejected'
          OR (
            b.status = 'accepted'
            AND (b.end_date || ' ' || b.end_time)::timestamp < NOW()
          )
        )
      ORDER BY b.start_date DESC, b.start_time DESC`,
      values: [userId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  getAdminCurrentBookings: async () => {
    const query = {
      text: `SELECT 
        b.id, b.booking_date, b.start_date, b.end_date, b.start_time, b.end_time,
        b.activity, b.organization, b.status, b.created_at,
        r.name as room_name, r.location as room_location,
        u.name as user_name, u.email as user_email
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON b.user_id = u.id
      WHERE
        b.status = 'pending'
        OR (
          b.status = 'accepted'
          AND (b.end_date || ' ' || b.end_time)::timestamp >= NOW()
        )
      ORDER BY b.created_at DESC`,
    };

    const result = await pool.query(query);
    return result.rows;
  },

  getAdminHistoryBookings: async () => {
    const query = {
      text: `SELECT 
        b.id, b.booking_date, b.start_date, b.end_date, b.start_time, b.end_time,
        b.activity, b.organization, b.status, b.created_at,
        r.name as room_name, r.location as room_location,
        u.name as user_name, u.email as user_email
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON b.user_id = u.id
      WHERE
        b.status = 'rejected'
        OR (
          b.status = 'accepted'
          AND (b.end_date || ' ' || b.end_time)::timestamp < NOW()
        )
      ORDER BY b.start_date DESC, b.start_time DESC`,
    };

    const result = await pool.query(query);
    return result.rows;
  },

  updateBookingStatus: async (bookingId, status) => {
    const query = {
      text: 'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING id',
      values: [status, bookingId],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Booking tidak ditemukan');
    }

    return result.rows[0].id;
  },
};

export default BookingsRepositories;
