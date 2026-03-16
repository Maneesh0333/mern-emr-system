import express from "express";
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
} from "../controllers/appointment.contoller.js";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { appointmentSchema } from "../validations/appointment.validation.js";

const router = express.Router();

router.use(isAuthenticated);

router.post(
  "/",
  restrictTo("RECEPTIONIST", "SUPER_ADMIN"),
  validate(appointmentSchema),
  createAppointment,
);
router.get(
  "/",
  restrictTo("SUPER_ADMIN", "DOCTOR", "RECEPTIONIST"),
  getAppointments,
);

router.patch(
  "/:id/status",
  restrictTo("SUPER_ADMIN", "DOCTOR", "RECEPTIONIST"),
  updateAppointmentStatus,
);

export default router;
