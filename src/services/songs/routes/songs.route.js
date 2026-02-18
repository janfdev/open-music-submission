import express from "express";
import {
  validateSongPayload,
  validateSongUpdatePayload,
} from "../validator/song.validation.js";

import {
  createSong,
  getAllSong,
  getSongById,
  editSongById,
  deleteSongById,
} from "../controller/songs.controller.js";

const router = express.Router();

router.get("/songs", getAllSong);
router.get("/songs/:id", getSongById);
router.post("/songs", validateSongPayload, createSong);
router.put("/songs/:id", validateSongUpdatePayload, editSongById);
router.delete("/songs/:id", deleteSongById);

export default router;
