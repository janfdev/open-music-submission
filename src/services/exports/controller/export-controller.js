import response from "../../../utils/response.js";
import exportService from "../producers/export-service.js";
import playlistRepositories from "../../playlist/repositories/playlist.repositories.js";

export const exportPlaylist = async (req, res) => {
  const { targetEmail } = req.validated;
  const { playlistId } = req.params;
  const userId = req.user.id;

  // Verifikasi bahwa user adalah pemilik playlist
  await playlistRepositories.verifyPlaylistOwner(playlistId, userId);

  const message = {
    playlistId,
    targetEmail,
  };

  await exportService.sendExportPlaylist("export:playlist", message);

  response(res, 201, "success", "Permintaan anda sedang kami proses");
};
