import { Pool } from "pg";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

class UserRepository {
  constructor() {
    this.pool = new Pool();
  }

  async createUser({ username, password, fullname }) {
    const randomId = nanoid(16);
    const userId = `user-${randomId}`;

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [
        userId,
        username,
        hashedPassword,
        fullname,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async verifyNewUsername(username) {
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this.pool.query(query);

    return result.rows.length > 0;
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: "SELECT * FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      return null;
    }

    const user = result.rows[0];

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return null;
    }

    return user;
  }
}

export default new UserRepository();
