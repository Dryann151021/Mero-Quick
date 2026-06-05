import { Hono } from 'hono';
import {
  addRoom,
  getRooms,
  getRoomById,
  editRoomById,
  deleteRoomById
} from '../controller/rooms-controller.js';
import { validate } from '../../../middlewares/validate.js';
import { roomPayloadSchema } from '../validator/schema.js';
import authenticateToken, { requireAdmin } from '../../../middlewares/auth.js';

const routes = new Hono();

routes.post('/', authenticateToken, requireAdmin, validate(roomPayloadSchema), addRoom);
routes.get('/', getRooms);
routes.get('/:id', getRoomById);
routes.put('/:id', authenticateToken, requireAdmin, validate(roomPayloadSchema), editRoomById);
routes.delete('/:id', authenticateToken, requireAdmin, deleteRoomById);

export default routes;
