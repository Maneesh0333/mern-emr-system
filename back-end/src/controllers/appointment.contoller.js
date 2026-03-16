import { asyncHandler } from "../middleware/async.middleware.js";
import Appointment from "../models/appointment.model.js";
import DoctorSchedule from "../models/DoctorSchedule.model.js";
import User from "../models/User.model.js";

export const createAppointment = asyncHandler(async (req, res) => {
  const {
    doctor,
    patientName,
    phone,
    age,
    reason,
    appointmentTime,
    department,
  } = req.body;

  const date = new Date(appointmentTime);

  // Get weekday
  const day = date.toLocaleString("en-US", { weekday: "long" });

  const isDoctor = await User.findOne({ _id: doctor, role: "DOCTOR" });

  if (!isDoctor) {
    return res.status(404).json({
      success: false,
      message: "Doctor not found.",
    });
  }

  // Find doctor's schedule
  const schedule = await DoctorSchedule.findOne({
    doctor,
    day,
    working: true,
  });

  if (!schedule) {
    return res.status(404).json({
      success: false,
      message: "Doctor not available on this day",
    });
  }

  // Convert appointment time to minutes from midnight
  const minutes = date.getHours() * 60 + date.getMinutes();

  // Check working hours
  if (minutes < schedule.start || minutes >= schedule.end) {
    return res.status(400).json({
      success: false,
      message: "Appointment outside doctor working hours",
    });
  }

  // Check slot alignment
  if ((minutes - schedule.start) % schedule.slot !== 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid appointment slot",
    });
  }

  // Check if slot already booked
  const exists = await Appointment.findOne({
    doctor,
    appointmentTime,
    status: { $ne: "cancelled" },
  }).lean();

  if (exists) {
    return res.status(400).json({
      success: false,
      message: "Slot already booked",
    });
  }

  try {
    await Appointment.create({
      doctor,
      patientName,
      phone,
      age,
      reason,
      appointmentTime,
      department,
      status: "scheduled",
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked",
      });
    }
    throw err;
  }

  return res.json({
    success: true,
    message: "Appointment booked successfully",
  });
});

export const getAppointments = asyncHandler(async (req, res) => {
  const { id, role } = req.user;
  const { status = "All", search = "", date } = req.query;

  const match = {};
  const statsMatch = {};

  if(role === "DOCTOR"){
    match.doctor = id;
  }

  // DATE FILTER (applies to both)
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    match.appointmentTime = { $gte: start, $lte: end };
    statsMatch.appointmentTime = { $gte: start, $lte: end };
  }

  if (status !== "All") {
    match.status = status;
  }

  if (search) {
    match.$or = [
      { patientName: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const [appointments, totalAppointments, scheduled, completed, cancelled] =
    await Promise.all([
      Appointment.find(match)
        .populate("doctor", "name department")
        .sort({ appointmentTime: -1 })
        .lean(),

      Appointment.countDocuments({ ...statsMatch, status: "scheduled" }),

      Appointment.countDocuments({ ...statsMatch, status: "scheduled" }),
      Appointment.countDocuments({ ...statsMatch, status: "completed" }),
      Appointment.countDocuments({ ...statsMatch, status: "cancelled" }),
    ]);

  res.json({
    success: true,
    message: "Appointments fetched.",
    data: {
      appointments,
      totalAppointments,
      stats: {
        scheduled,
        completed,
        cancelled,
      },
    },
  });
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["completed", "cancelled"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status",
    });
  }

  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  );

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: "Appointment not found",
    });
  }

  res.json({
    success: true,
    message: "Appointment updated",
    data: appointment,
  });
});

