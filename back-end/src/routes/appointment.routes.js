import express from "express";
import { createAppointment, getAppointments, getAppointmentsByDoctor, getTodayAppointments } from "../controllers/appointment.contoller.js";


const router = express.Router();

router.post("/", createAppointment);
router.get("/", getAppointmentsByDoctor);
router.get("/", getAppointments);
router.get("/today", getTodayAppointments);

export default router;