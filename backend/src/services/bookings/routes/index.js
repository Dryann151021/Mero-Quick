import { Hono } from 'hono';
import {
  addBooking,
  getMyBookings,
  getAdminBookings,
  updateBookingStatus,
} from '../controller/bookings-controller.js';
import { validate } from '../../../middlewares/validate.js';
import { bookingPayloadSchema } from '../validator/schema.js';
import authenticateToken, { requireAdmin } from '../../../middlewares/auth.js';

const routes = new Hono();

routes.post('/', authenticateToken, validate(bookingPayloadSchema), addBooking);
routes.get('/my-bookings', authenticateToken, getMyBookings);
routes.get('/admin', authenticateToken, requireAdmin, getAdminBookings);
routes.patch('/:id/status', authenticateToken, requireAdmin, updateBookingStatus);

export default routes;
