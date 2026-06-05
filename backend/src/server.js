import app from './server/index.js';
import appLogger from './config/logger.js';

const port = process.env.PORT;
appLogger.info(`Server is running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
