import express from "express";

import {
  createPrescription,
  getAppointmentPrescription,
} from "../controllers/prescription.controller.js";

import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/", restrictTo("DOCTOR"), createPrescription);

router.get(
  "/:appointmentId",
  restrictTo("DOCTOR", "SUPER_ADMIN", "RECEPTIONIST"),
  getAppointmentPrescription,
);

export default router;
