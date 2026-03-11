import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import { addOrUpdateSchedule, getSchedule } from "../controllers/schedule.controller.js";


const router = express.Router();

router.use(isAuthenticated);
router.use(restrictTo("DOCTOR", "SUPER_ADMIN"));

// Get all schedules for a doctor
router.get("/", getSchedule);
// Add or update a day schedule
router.post("/", addOrUpdateSchedule);
;

export default router;