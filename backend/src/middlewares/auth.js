import TokenManager from '../security/token-manager.js';
import response from '../utils/response.js';
import AuthorizationError from '../exceptions/authorization-error.js';

async function authenticateToken(c, next) {
  const token = c.req.header('authorization');
  if (token && token.indexOf('Bearer ') !== -1) {
    try {
      const user = TokenManager.verify(
        token.split('Bearer ')[1],
        process.env.ACCESS_TOKEN_KEY
      );
      c.set('user', user);
      return await next();
    } catch (error) {
      return response(c, 401, error.message, null);
    }
  }

  return response(c, 401, 'Unauthorized', null);
}

export async function requireAdmin(c, next) {
  const user = c.get('user');
  if (!user || user.role !== 'admin') {
    throw new AuthorizationError('Forbidden: Admin only');
  }
  return next();
}

export default authenticateToken;
