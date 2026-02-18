import { Pool } from "pg";
import { nanoid } from "nanoid";
import NotFoundError from "../../../exceptions/not-found-error.js";
import InvariantError from "../../../exceptions/invariant-error.js";
import AuthorizationError from "../../../exceptions/authorization-error.js";

class PlaylistRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async createPlaylist({ name, owner }) {
    const randomId = nanoid(16);
    const id = `playlist-${randomId}`;

    const query = {
      text: "INSERT INTO playlist (id, name, owner) VALUES ($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async getAllPlaylist(owner) {
    const query = {
      text: `SELECT p.id, p.name, u.username 
             FROM playlist p 
             LEFT JOIN users u ON p.owner = u.id
             LEFT JOIN collaborations c ON c.playlist_id = p.id
             WHERE p.owner = $1 OR c.user_id = $1
             GROUP BY p.id, p.name, u.username`,
      values: [owner],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async getPlaylistById(id) {
    const query = {
      text: "SELECT id, name, owner FROM playlist WHERE id = $1",
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    return result.rows[0];
  }

  async deletePlaylistById(id) {
    const query = {
      text: "DELETE FROM playlist WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlist-song-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES ($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Lagu gagal ditambahkan ke playlist");
    }
  }

  async getPlaylistSongs(playlistId) {
    const playlistQuery = {
      text: `SELECT p.id, p.name, u.username
             FROM playlist p
             LEFT JOIN users u ON p.owner = u.id
             WHERE p.id = $1`,
      values: [playlistId],
    };

    const playlistResult = await this.pool.query(playlistQuery);

    if (!playlistResult.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const songsQuery = {
      text: `SELECT s.id, s.title, s.performer
             FROM songs s
             INNER JOIN playlist_songs ps ON s.id = ps.song_id
             WHERE ps.playlist_id = $1`,
      values: [playlistId],
    };

    const songsResult = await this.pool.query(songsQuery);

    const playlist = playlistResult.rows[0];
    playlist.songs = songsResult.rows;

    return playlist;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan di playlist");
    }
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: "SELECT id, owner FROM playlist WHERE id = $1",
      values: [playlistId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      // Check if user is a collaborator
      const query = {
        text: "SELECT id FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
        values: [playlistId, userId],
      };

      const result = await this.pool.query(query);

      if (!result.rows.length) {
        throw new AuthorizationError(
          "Anda tidak berhak mengakses resource ini",
        );
      }
    }
  }

  async verifySongExists(songId) {
    const query = {
      text: "SELECT id FROM songs WHERE id = $1",
      values: [songId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }
  }
  async addActivity(playlistId, songId, userId, action) {
    const id = `activity-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: "INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action, time) VALUES ($1, $2, $3, $4, $5, $6)",
      values: [id, playlistId, songId, userId, action, time],
    };

    await this.pool.query(query);
  }

  async getActivities(playlistId) {
    const query = {
      text: `SELECT u.username, s.title, psa.action, psa.time
             FROM playlist_song_activities psa
             INNER JOIN users u ON psa.user_id = u.id
             INNER JOIN songs s ON psa.song_id = s.id
             WHERE psa.playlist_id = $1
             ORDER BY psa.time ASC`,
      values: [playlistId],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }
}

export default new PlaylistRepositories();
