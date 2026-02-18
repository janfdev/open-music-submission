import collaborationRepositories from "../repositories/collaboration.repositories.js";
import playlistRepositories from "../../playlist/repositories/playlist.repositories.js";
import response from "../../../utils/response.js";

export const addCollaboration = async (req, res, next) => {
  try {
    const { playlistId, userId } = req.validated;
    const { id: owner } = req.user;

    // Hanya owner yang bisa menambahkan kolaborator
    await playlistRepositories.verifyPlaylistOwner(playlistId, owner);
    // Pastikan user yang ditambahkan ada
    await collaborationRepositories.verifyUserExists(userId);

    const collaborationId = await collaborationRepositories.addCollaboration(
      playlistId,
      userId,
    );

    return response(res, 201, "Kolaborasi berhasil ditambahkan", {
      collaborationId,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteCollaboration = async (req, res, next) => {
  try {
    const { playlistId, userId } = req.validated;
    const { id: owner } = req.user;

    // Hanya owner yang bisa menghapus kolaborator
    await playlistRepositories.verifyPlaylistOwner(playlistId, owner);
    await collaborationRepositories.deleteCollaboration(playlistId, userId);

    return response(res, 200, "Kolaborasi berhasil dihapus");
  } catch (error) {
    return next(error);
  }
};
