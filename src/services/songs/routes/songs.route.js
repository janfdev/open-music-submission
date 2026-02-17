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

router.get("/", getAllSong);
router.get("/:id", getSongById);
router.post("/", validateSongPayload, createSong);
router.put("/:id", validateSongUpdatePayload, editSongById);
router.delete("/:id", deleteSongById);

export default router;
