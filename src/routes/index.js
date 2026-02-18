import { Router } from "express";
import albums from "../services/albums/routes/album.route.js";
import songs from "../services/songs/routes/songs.route.js";
import users from "../services/users/routes/users.route.js";
import authentications from "../services/authentications/routes/authentication.route.js";
import playlists from "../services/playlist/routes/playlist.route.js";
import collaborations from "../services/collaborations/routes/collaboration.route.js";

const router = Router();

router.use("/", albums);
router.use("/", songs);
router.use("/", users);
router.use("/", authentications);
router.use("/", playlists);
router.use("/", collaborations);

export default router;
