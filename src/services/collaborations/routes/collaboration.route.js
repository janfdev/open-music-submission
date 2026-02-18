import { Router } from "express";
import validate from "../../../middlewares/validate.js";
import { CollaborationPayloadSchema } from "../validator/collaboration.validator.js";
import {
  addCollaboration,
  deleteCollaboration,
} from "../controller/collaboration.controller.js";
import authenticateToken from "../../../middlewares/auth.js";

const router = Router();

router.post(
  "/collaborations",
  authenticateToken,
  validate(CollaborationPayloadSchema),
  addCollaboration,
);

router.delete(
  "/collaborations",
  authenticateToken,
  validate(CollaborationPayloadSchema),
  deleteCollaboration,
);

export default router;
