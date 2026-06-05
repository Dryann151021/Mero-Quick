import AuthenticationRepositories from '../repositories/authentication-repositories.js';
import UserRepositories from '../../users/repositories/user-repositories.js';
import TokenManager from '../../../security/token-manager.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import AuthenticationError from '../../../exceptions/authentication-error.js';

export const login = async (c) => {
  const { email, password } = c.get('validated');
  const userId = await UserRepositories.verifyUserCredential(email, password);

  if (!userId) {
    throw new AuthenticationError('Kredensial yang Anda berikan salah');
  }

  const user = await UserRepositories.getUserById(userId);
  const role = user?.role || 'user';

  const fullname = user?.name || 'User';
  const accessToken = TokenManager.generateAccessToken({
    id: userId,
    role,
    fullname,
  });
  const refreshToken = TokenManager.generateRefreshToken({
    id: userId,
    role,
    fullname,
  });

  await AuthenticationRepositories.addRefreshToken(refreshToken);

  return response(c, 201, 'Authentication berhasil ditambahkan', {
    accessToken,
    refreshToken,
  });
};

export const refreshToken = async (c) => {
  const { refreshToken } = c.get('validated');

  const result =
    await AuthenticationRepositories.verifyRefreshToken(refreshToken);
  if (!result) {
    throw new InvariantError('Refresh token tidak valid');
  }

  const { id } = TokenManager.verifyRefreshToken(refreshToken);
  const user = await UserRepositories.getUserById(id);

  if (!user) {
    throw new AuthenticationError(
      'User tidak ditemukan atau akun sudah tidak aktif'
    );
  }

  const role = user.role;
  const fullname = user.name;
  const accessToken = TokenManager.generateAccessToken({ id, role, fullname });

  return response(c, 200, 'Access Token berhasil diperbarui', {
    accessToken,
  });
};

export const logout = async (c) => {
  const { refreshToken } = c.get('validated');

  const result =
    await AuthenticationRepositories.verifyRefreshToken(refreshToken);

  if (!result) {
    throw new InvariantError('Refresh token tidak valid');
  }

  await AuthenticationRepositories.deleteRefreshToken(refreshToken);
  return response(c, 200, 'Refresh Token berhasil dihapus');
};
