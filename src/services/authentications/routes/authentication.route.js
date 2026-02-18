import { Router } from "express";
import {
  Login,
  refreshToken,
  Logout,
} from "../controller/authentication.controller.js";

import validate from "../../../middlewares/validate.js";

import {
  postAuthenticationPayloadSchema,
  putAuthenticationPayloadSchema,
  deleteAuthenticationPayloadSchema,
} from "../validator/authentication.validator.js";

const router = Router();

// Login
router.post(
  "/authentications",
  validate(postAuthenticationPayloadSchema),
  Login,
);

// Update Refresh Token
router.put(
  "/authentications",
  validate(putAuthenticationPayloadSchema),
  refreshToken,
);

// Logout / Delete
router.delete(
  "/authentications",
  validate(deleteAuthenticationPayloadSchema),
  Logout,
);

export default router;
