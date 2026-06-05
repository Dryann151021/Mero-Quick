import { Hono } from 'hono';
import { uploadImages } from '../controller/upload-controller.js';
import authenticateToken from '../../../middlewares/auth.js';

const routes = new Hono();

routes.post(
  '/images',
  authenticateToken,
  uploadImages
);

export default routes;
