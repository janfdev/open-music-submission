import { Pool } from "pg";
import { nanoid } from "nanoid";
import InvariantError from "../../../exceptions/invariant-error.js";
import NotFoundError from "../../../exceptions/not-found-error.js";

class LikeRepository {
  constructor() {
    this._pool = new Pool();
  }

  async verifyAlbumExists(albumId) {
    const query = {
      text: "SELECT id FROM albums WHERE id = $1",
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }
  }

  async checkLike(userId, albumId) {
    const query = {
      text: "SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    return result.rows.length > 0;
  }

  async addLike(userId, albumId) {
    const id = `like-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO user_album_likes (id, user_id, album_id) VALUES ($1, $2, $3) RETURNING id",
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Gagal menyukai album");
    }
  }

  async deleteLike(userId, albumId) {
    const query = {
      text: "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id",
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Gagal batal menyukai album");
    }
  }

  async getLikesCount(albumId) {
    const query = {
      text: "SELECT COUNT(id) FROM user_album_likes WHERE album_id = $1",
      values: [albumId],
    };

    const result = await this._pool.query(query);

    return parseInt(result.rows[0].count, 10);
  }
}

export default new LikeRepository();
