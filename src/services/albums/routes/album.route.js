import express from "express";
import {
  createAlbum,
  editAlbumById,
  getAlbumById,
  getAllAlbums,
  deleteAlbumById,
} from "../controller/album.controller.js";
import {
  validateAlbumPayload,
  validateAlbumUpdatePayload,
} from "../validator/album.validation.js";

const router = express.Router();

router.get("/", getAllAlbums);
router.get("/:id", getAlbumById);
router.post("/", validateAlbumPayload, createAlbum);
router.put("/:id", validateAlbumUpdatePayload, editAlbumById);
router.delete("/:id", deleteAlbumById);

export default router;
