import { Router } from "express";
import { exportPlaylist } from "../controller/export-controller.js";
import authenticateToken from "../../../middlewares/auth.js";
import validate from "../../../middlewares/validate.js";
import { exportPlaylistSchema } from "../validator/schema.js";

const router = Router();

router.post(
  "/export/playlists/:playlistId",
  authenticateToken,
  validate(exportPlaylistSchema),
  exportPlaylist,
);

export default router;
