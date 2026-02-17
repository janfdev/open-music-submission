import { nanoid } from "nanoid";
import { Pool } from "pg";

class SongRepository {
  constructor() {
    this.pool = new Pool();
  }

  async createSong({ title, year, genre, performer, duration, albumId }) {
    const randomId = nanoid(16);
    const id = `song-${randomId}`;

    const query = {
      text: 'INSERT INTO songs (id, title, year, genre, performer, duration, "albumId") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, title, year, genre, performer, duration, "albumId" as albumId',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  //   Get All SOng

  async getAllSong({ title, performer }) {
    let queryText = "SELECT id, title, performer FROM songs";
    const values = [];

    if (title || performer) {
      queryText += " WHERE";
      if (title) {
        values.push(`%${title}%`);
        queryText += ` title ILIKE $${values.length}`;
      }

      if (performer) {
        if (title) queryText += " AND";
        values.push(`%${performer}%`);
        queryText += ` performer ILIKE $${values.length}`;
      }
    }

    const query = {
      text: queryText,
      values,
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  //   GET SONG BY ID
  async getSongById(id) {
    const query = {
      text: 'SELECT id, title, year, genre, performer, duration, "albumId" FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  //   EDIT SONG

  async editSongById({ id, title, year, genre, performer, duration, albumId }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6 WHERE id = $7 RETURNING id, title, year, genre, performer, duration, "albumId" as albumId',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  //   DELETE SONG

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this.pool.query(query);

    return result.rows[0]?.id ?? null;
  }

  async getSongsByAlbumId(albumId) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
      values: [albumId],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }
}

export default new SongRepository();
