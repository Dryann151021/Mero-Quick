import { Hono } from 'hono';
import {
  login,
  refreshToken,
  logout,
} from '../controller/authentications-controller.js';
import { validate } from '../../../middlewares/validate.js';
import {
  postAuthenticationPayloadSchema,
  putAuthenticationPayloadSchema,
  deleteAuthenticationPayloadSchema,
} from '../validator/schema.js';

const routes = new Hono();

routes.post('/', validate(postAuthenticationPayloadSchema), login);
routes.put('/', validate(putAuthenticationPayloadSchema), refreshToken);
routes.delete('/', validate(deleteAuthenticationPayloadSchema), logout);

export default routes;
