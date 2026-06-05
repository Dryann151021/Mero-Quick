import UserRepositories from '../repositories/user-repositories.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';

export const createUser = async (c) => {
  const { email, password, name, address, phoneNumber } = c.get('validated');

  const isEmailExist = await UserRepositories.verifyNewEmail(email);
  if (isEmailExist) {
    throw new InvariantError('Gagal menambahkan user. Email sudah digunakan.');
  }

  const user = await UserRepositories.createUser({
    email,
    password,
    name,
    address,
    phoneNumber,
  });

  if (!user) {
    throw new InvariantError('Gagal menambahkan user');
  }

  return response(c, 201, 'User berhasil ditambahkan', user);
};

export const getUserById = async (c) => {
  const id = c.req.param('id');
  const user = await UserRepositories.getUserById(id);

  if (!user) {
    throw new NotFoundError('User tidak ditemukan');
  }

  return response(c, 200, 'User berhasil ditemukan', { user: user });
};
