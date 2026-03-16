import express from "express";
import {
  getDoctorDashboard,
  getDoctorSchedule,
  getAvailableDoctors,
  updateDoctor,
  enableDoctor,
  disableDoctor,
  getAdminDoctors,
  createDoctor,
  getSchedule,
  addOrUpdateSchedule,
} from "../controllers/doctor.controller.js";

import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import { createDoctorSchema } from "../validations/docter.validation.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

router.use(isAuthenticated);


// ADMIN DOCTOR MANAGEMENT
router.get("/", restrictTo("SUPER_ADMIN"), getAdminDoctors);

router.post(
  "/",
  restrictTo("SUPER_ADMIN"),
  validate(createDoctorSchema),
  createDoctor
);

router.patch("/:id", restrictTo("SUPER_ADMIN"), updateDoctor);

router.patch("/:id/enable", restrictTo("SUPER_ADMIN"), enableDoctor);

router.patch("/:id/disable", restrictTo("SUPER_ADMIN"), disableDoctor);

// RECEPTIONIST
router.get("/available", restrictTo("RECEPTIONIST", "SUPER_ADMIN"), getAvailableDoctors);


router.get("/me/schedule", restrictTo("DOCTOR"), getSchedule);
router.post("/me/schedule", restrictTo("DOCTOR"), addOrUpdateSchedule);

router.get("/dashboard", restrictTo("DOCTOR"), getDoctorDashboard);

router.get(
  "/:id/schedule",
  restrictTo("DOCTOR", "RECEPTIONIST", "SUPER_ADMIN"),
  getDoctorSchedule
);

export default router;