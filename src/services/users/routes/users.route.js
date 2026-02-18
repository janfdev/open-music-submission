import { Router } from "express";
import { createUser } from "../controller/users.controller.js";
import validate from "../../../middlewares/validate.js";
import { userPayloadSchema } from "../validator/users.validator.js";

const router = Router();

router.post("/users", validate(userPayloadSchema), createUser);

export default router;
