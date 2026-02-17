import { Router } from "express";
import albums from "../services/albums/routes/album.route.js";
import songs from "../services/songs/routes/songs.route.js";

const router = Router();

// Music V1
router.use("/albums", albums);
router.use("/songs", songs);

export default router;
