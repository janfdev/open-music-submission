import { Router } from "express";
import validate from "../../../middlewares/validate.js";
import {
  PlaylistPayloadSchema,
  PlaylistSongPayloadSchema,
} from "../validator/playlist.validator.js";
import {
  createPlaylist,
  getAllPlaylist,
  getPlaylistById,
  deletePlaylistById,
  addSongToPlaylist,
  getPlaylistSongs,
  deleteSongFromPlaylist,
  getPlaylistActivities,
} from "../controller/playlist.controller.js";
import authenticateToken from "../../../middlewares/auth.js";

const router = Router();

// Playlist CRUD
router.post(
  "/playlists",
  authenticateToken,
  validate(PlaylistPayloadSchema),
  createPlaylist,
);
router.get("/playlists", authenticateToken, getAllPlaylist);
router.get("/playlists/:id", authenticateToken, getPlaylistById);
router.delete("/playlists/:id", authenticateToken, deletePlaylistById);

// Playlist Songs
router.post(
  "/playlists/:id/songs",
  authenticateToken,
  validate(PlaylistSongPayloadSchema),
  addSongToPlaylist,
);

router.get("/playlists/:id/songs", authenticateToken, getPlaylistSongs);

router.delete(
  "/playlists/:id/songs",
  authenticateToken,
  validate(PlaylistSongPayloadSchema),
  deleteSongFromPlaylist,
);

// Playlist Activities
router.get(
  "/playlists/:id/activities",
  authenticateToken,
  getPlaylistActivities,
);

export default router;
