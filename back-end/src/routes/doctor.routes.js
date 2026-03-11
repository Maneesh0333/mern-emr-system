import express from "express";
import {
  getDoctorAppointments,
  getDoctorDashboard,
  getDoctorSchedule,
  getDoctors,
  updateAvailability,
} from "../controllers/doctor.controller.js";

import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(isAuthenticated);

// public doctor routes
router.get("/", getDoctors);

// doctor dashboard
router.get("/dashboard", restrictTo("DOCTOR"), getDoctorDashboard);

// doctor + receptionist routes
router.use(restrictTo("DOCTOR", "RECEPTIONIST"));

router.get("/appointments", getDoctorAppointments);
router.get("/:id", getDoctorSchedule);

// doctor only update
router.put("/:doctorId", restrictTo("DOCTOR"), updateAvailability);

export default router;