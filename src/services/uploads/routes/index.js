import { Router } from "express";
import authenticateToken from "../../../middlewares/auth.js";
import { uploadCover } from "../controller/upload-controller.js";
import { upload } from "../storage/storage-config.js";

const router = Router();

router.post(
  "/albums/:id/covers",
  authenticateToken,
  upload.single("cover"),
  uploadCover,
);

export default router;
