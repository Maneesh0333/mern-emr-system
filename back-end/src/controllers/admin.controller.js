import { asyncHandler } from "../middleware/async.middleware.js";
import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import AppError from "../utils/AppError.js";
import Appointment from "../models/appointment.model.js";


export const getAdminDashboard = async (req, res) => {
  const totalDoctors = await User.countDocuments({ role: "DOCTOR" });
  const totalPatients = await Appointment.distinct("phone");

  const today = new Date().toISOString().split("T")[0];

  const todayAppointments = await Appointment.countDocuments({
    date: today,
  });

  const completedAppointments = await Appointment.countDocuments({
    status: "completed",
  });

  const cancelledAppointments = await Appointment.countDocuments({
    status: "cancelled",
  });

  const scheduledAppointments = await Appointment.countDocuments({
    status: "scheduled",
  });

  res.json({
    success: true,
    data: {
      stats: {
        doctors: totalDoctors,
        patients: totalPatients.length,
        todayAppointments,
        completedAppointments,
        cancelledAppointments,
        scheduledAppointments,
      },
    },
  });
};