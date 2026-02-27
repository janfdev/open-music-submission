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

import {
  addLike,
  deleteLike,
  getLikesCount,
} from "../controller/like.controller.js";
import authenticateToken from "../../../middlewares/auth.js";

const router = express.Router();

router.get("/albums", getAllAlbums);
router.get("/albums/:id", getAlbumById);
router.post("/albums", validateAlbumPayload, createAlbum);
router.put("/albums/:id", validateAlbumUpdatePayload, editAlbumById);
router.delete("/albums/:id", deleteAlbumById);

router.post("/albums/:id/likes", authenticateToken, addLike);
router.delete("/albums/:id/likes", authenticateToken, deleteLike);
router.get("/albums/:id/likes", getLikesCount);

export default router;
