import express from "express";
import { getAdminDashboard } from "../controllers/admin.controller.js";

import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(isAuthenticated);

router.get("/dashboard", restrictTo("SUPER_ADMIN"), getAdminDashboard);

export default router;
