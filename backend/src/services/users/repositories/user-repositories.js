import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import pool from '../../../config/database.js';

class UserRepositories {
  constructor() {
    this._pool = pool;
  }

  async createUser({ email, password, name, address, phoneNumber }) {
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO users (id, name, email, password, address, phone_number, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [
        id,
        name,
        email,
        hashedPassword,
        address,
        phoneNumber,
        'user',
        createdAt,
        updatedAt,
      ],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async verifyNewEmail(email) {
    const query = {
      text: 'SELECT email FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);
    return result.rows.length > 0;
  }

  async getUserById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async verifyUserCredential(email, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE email = $1',
      values: [email],
    };

    const user = await this._pool.query(query);
    if (!user.rows.length) {
      return null;
    }

    const { id, password: hashedPassword } = user.rows[0];
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordMatch) {
      return null;
    }

    return id;
  }
}

export default new UserRepositories();
