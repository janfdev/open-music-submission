import AlbumRepository from "../repositories/album.repositories.js";
import SongRepository from "../../songs/repositories/songs.repositories.js";
import response from "../../../utils/response.js";

export const createAlbum = async (req, res, next) => {
  const { name, year } = req.validated ?? req.body;

  const album = await AlbumRepository.createAlbum({ name, year });

  if (!album) {
    const error = new Error("Gagal menambahkan album");
    error.statusCode = 400;
    return next(error);
  }

  return response(res, 201, "Album berhasil ditambahkan", {
    albumId: album.id,
  });
};

export const getAllAlbums = async (req, res, next) => {
  const albums = await AlbumRepository.getAllAlbum();

  return response(res, 200, null, { albums });
};

export const getAlbumById = async (req, res, next) => {
  const { id } = req.params;

  const album = await AlbumRepository.getAlbumById(id);

  if (!album) {
    const error = new Error("Album tidak ditemukan");
    error.statusCode = 404;
    return next(error);
  }

  const songs = await SongRepository.getSongsByAlbumId(id);

  return response(res, 200, "Album berhasil didapatkan", {
    album: {
      ...album,
      songs,
    },
  });
};

export const editAlbumById = async (req, res, next) => {
  const { id } = req.params;
  const { name, year } = req.validated;

  const album = await AlbumRepository.editAlbumById({ id, name, year });

  if (!album) {
    const error = new Error("Gagal memperbarui album. Id tidak ditemukan");
    error.statusCode = 404;
    return next(error);
  }

  return response(res, 200, "Album berhasil diperbarui");
};

export const deleteAlbumById = async (req, res, next) => {
  const { id } = req.params;

  const deletedAlbum = await AlbumRepository.deleteAlbumById(id);

  if (!deletedAlbum) {
    const error = new Error("Album gagal dihapus. Id tidak ditemukan");
    error.statusCode = 404;
    return next(error);
  }

  return response(res, 200, "Album berhasil dihapus");
};
