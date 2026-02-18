import playlistRepositories from "../repositories/playlist.repositories.js";
import response from "../../../utils/response.js";
import InvariantError from "../../../exceptions/invariant-error.js";

export const createPlaylist = async (req, res, next) => {
  try {
    const { name } = req.validated;
    const { id: owner } = req.user;

    const playlist = await playlistRepositories.createPlaylist({
      name,
      owner,
    });

    if (!playlist) {
      return next(new InvariantError("Gagal Menambahkan Playlist"));
    }

    return response(res, 201, "Playlist berhasil ditambahkan", {
      playlistId: playlist.id,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllPlaylist = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    const playlists = await playlistRepositories.getAllPlaylist(owner);

    return response(res, 200, "Playlist berhasil didapatkan", { playlists });
  } catch (error) {
    return next(error);
  }
};

export const getPlaylistById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    await playlistRepositories.verifyPlaylistAccess(id, userId);
    const playlist = await playlistRepositories.getPlaylistById(id);

    return response(res, 200, "Playlist berhasil didapatkan", { playlist });
  } catch (error) {
    return next(error);
  }
};

export const deletePlaylistById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: owner } = req.user;

    await playlistRepositories.verifyPlaylistOwner(id, owner);
    await playlistRepositories.deletePlaylistById(id);

    return response(res, 200, "Playlist berhasil dihapus");
  } catch (error) {
    return next(error);
  }
};

export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { id: playlistId } = req.params;
    const { songId } = req.validated;
    const { id: userId } = req.user;

    await playlistRepositories.verifyPlaylistAccess(playlistId, userId);
    await playlistRepositories.verifySongExists(songId);
    await playlistRepositories.addSongToPlaylist(playlistId, songId);
    await playlistRepositories.addActivity(playlistId, songId, userId, "add");

    return response(res, 201, "Lagu berhasil ditambahkan ke playlist");
  } catch (error) {
    return next(error);
  }
};

export const getPlaylistSongs = async (req, res, next) => {
  try {
    const { id: playlistId } = req.params;
    const { id: userId } = req.user;

    await playlistRepositories.verifyPlaylistAccess(playlistId, userId);
    const playlist = await playlistRepositories.getPlaylistSongs(playlistId);

    return response(res, 200, "Playlist berhasil didapatkan", { playlist });
  } catch (error) {
    return next(error);
  }
};

export const deleteSongFromPlaylist = async (req, res, next) => {
  try {
    const { id: playlistId } = req.params;
    const { songId } = req.validated;
    const { id: userId } = req.user;

    await playlistRepositories.verifyPlaylistAccess(playlistId, userId);
    await playlistRepositories.deleteSongFromPlaylist(playlistId, songId);
    await playlistRepositories.addActivity(
      playlistId,
      songId,
      userId,
      "delete",
    );

    return response(res, 200, "Lagu berhasil dihapus dari playlist");
  } catch (error) {
    return next(error);
  }
};

export const getPlaylistActivities = async (req, res, next) => {
  try {
    const { id: playlistId } = req.params;
    const { id: userId } = req.user;

    await playlistRepositories.verifyPlaylistAccess(playlistId, userId);
    const activities = await playlistRepositories.getActivities(playlistId);

    return response(res, 200, "Aktivitas playlist berhasil didapatkan", {
      playlistId,
      activities,
    });
  } catch (error) {
    return next(error);
  }
};
