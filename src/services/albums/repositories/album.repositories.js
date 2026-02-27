import { nanoid } from "nanoid";
import { Pool } from "pg";

class AlbumRepository {
  constructor() {
    this.pool = new Pool();
  }

  async createAlbum({ name, year }) {
    const randomId = nanoid(16);
    const id = `album-${randomId}`;

    const query = {
      text: "INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id, name, year",
      values: [id, name, year],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async getAllAlbum() {
    const result = await this.pool.query("SELECT * FROM albums");
    return result.rows;
  }

  async getAlbumById(id) {
    const query = {
      text: "SELECT id, name, year, cover FROM albums WHERE id = $1",
      values: [id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async updateAlbumCover(id, coverUrl) {
    const query = {
      text: "UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id",
      values: [coverUrl, id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async editAlbumById({ id, name, year }) {
    const query = {
      text: "UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id, name, year",
      values: [name, year, id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this.pool.query(query);

    return result.rows[0]?.id ?? null;
  }
}

export default new AlbumRepository();
