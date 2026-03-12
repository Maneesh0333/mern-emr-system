import express from "express";
import { getMe, login, refreshToken } from "../controllers/auth.controller.js";
import { loginSchema } from "../validations/auth.validation.js";
import { validate } from "../middleware/validate.middleware.js";
import { logout } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/me", isAuthenticated, getMe);

export default router;