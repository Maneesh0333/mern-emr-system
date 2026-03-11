import express from "express";
import {
  createDoctor,
  disableDoctor,
  enableDoctor,
  getAdminDashboard,
  getAppointments,
  getDoctors,
  updateAppointmentStatus,
  updateDoctor,
} from "../controllers/admin.controller.js";

import { validate } from "../middleware/validate.middleware.js";
import { createDoctorSchema } from "../validations/docter.validation.js";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(isAuthenticated);

// SUPER ADMIN ONLY
router.get("/doctors", restrictTo("SUPER_ADMIN"), getDoctors);
router.post(
  "/doctors",
  restrictTo("SUPER_ADMIN"),
  validate(createDoctorSchema),
  createDoctor,
);

router.get("/dashboard", restrictTo("SUPER_ADMIN"), getAdminDashboard);

router.get("/appointments", restrictTo("SUPER_ADMIN"), getAppointments);
router.patch(
  "/appointments/:id/status",
  restrictTo("SUPER_ADMIN", "DOCTOR"),
  updateAppointmentStatus,
);

router.patch("/doctors/:id", restrictTo("SUPER_ADMIN"), updateDoctor);

// SUPER_ADMIN + DOCTOR
router.patch(
  "/doctors/:id/enable",
  restrictTo("SUPER_ADMIN"),
  enableDoctor,
);

router.patch(
  "/doctors/:id/disable",
  restrictTo("SUPER_ADMIN"),
  disableDoctor,
);

export default router;
