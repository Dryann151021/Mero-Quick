import 'dotenv/config';

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import ErrorHandler from '../middlewares/error.js';
import router from '../routes/index.js';

const app = new Hono();
app.use('*', logger());
app.use('*', cors());
app.route('/', router);
app.onError(ErrorHandler);

// Serve static upload files
app.get('/uploads/:filename', async (c) => {
  const filename = c.req.param('filename');
  const filepath = `./src/services/uploads/files/images/${filename}`;
  const file = Bun.file(filepath);
  if (await file.exists()) {
    return c.body(file);
  }
  return c.text('Not Found', 404);
});

export default app;
