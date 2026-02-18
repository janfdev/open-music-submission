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

router.get("/albums", getAllAlbums);
router.get("/albums/:id", getAlbumById);
router.post("/albums", validateAlbumPayload, createAlbum);
router.put("/albums/:id", validateAlbumUpdatePayload, editAlbumById);
router.delete("/albums/:id", deleteAlbumById);

export default router;
