import { Hono } from 'hono';

import usersRoutes from '../services/users/routes/index.js';
import authenticationsRoutes from '../services/authentications/routes/index.js';
import roomsRoutes from '../services/rooms/routes/index.js';
import uploadRoutes from '../services/uploads/routes/index.js';
import bookingsRoutes from '../services/bookings/routes/index.js';

const router = new Hono();

router.route('/users', usersRoutes);
router.route('/authentications', authenticationsRoutes);
router.route('/rooms', roomsRoutes);
router.route('/upload', uploadRoutes);
router.route('/bookings', bookingsRoutes);

export default router;
