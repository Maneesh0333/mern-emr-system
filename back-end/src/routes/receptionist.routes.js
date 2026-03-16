import express from "express";
import {
  createReceptionist,
  disableReceptionist,
  enableReceptionist,
  getReceptionistDashboard,
  getReceptionists,
  updateReceptionist,
} from "../controllers/receptionist.controller.js";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/dashboard", restrictTo("RECEPTIONIST"), getReceptionistDashboard);

router.use(restrictTo("SUPER_ADMIN"));
router.get("/", getReceptionists);
router.post("/", createReceptionist);
router.patch("/:id", updateReceptionist);
router.patch("/:id/enable", enableReceptionist);
router.patch("/:id/disable", disableReceptionist);

export default router;
