import songsRepositories from "../repositories/songs.repositories.js";
import response from "../../../utils/response.js";

export const createSong = async (req, res, next) => {
  const { title, year, genre, performer, duration, albumId } = req.validated;

  const song = await songsRepositories.createSong({
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  });

  if (!song) {
    const error = new Error("Gagal menambahkan lagu");
    error.statusCode = 400;
    return next(error);
  }

  return response(res, 201, "Lagu berhasil ditambahkan", { songId: song.id });
};

export const getAllSong = async (req, res, next) => {
  const { title, performer } = req.query;
  const songs = await songsRepositories.getAllSong({ title, performer });

  return response(res, 200, null, { songs });
};

export const getSongById = async (req, res, next) => {
  const { id } = req.params;

  const song = await songsRepositories.getSongById(id);

  if (!song) {
    const error = new Error("Lagu tidak ditemukan");
    error.statusCode = 404;
    return next(error);
  }

  return response(res, 200, "Lagu berhasil didapatkan", { song });
};

export const editSongById = async (req, res, next) => {
  const { id } = req.params;
  const { title, year, genre, performer, duration, albumId } = req.validated;

  const song = await songsRepositories.editSongById({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  });

  if (!song) {
    const error = new Error("Gagal memperbarui lagu. Id tidak ditemukan");
    error.statusCode = 404;
    return next(error);
  }

  return response(res, 200, "Lagu berhasil diperbarui");
};

export const deleteSongById = async (req, res, next) => {
  const { id } = req.params;

  const deletedSong = await songsRepositories.deleteSongById(id);

  if (!deletedSong) {
    const error = new Error("Lagu gagal dihapus. Id tidak ditemukan");
    error.statusCode = 404;
    return next(error);
  }

  return response(res, 200, "Lagu berhasil dihapus");
};
