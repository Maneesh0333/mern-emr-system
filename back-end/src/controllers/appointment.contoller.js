import { asyncHandler } from "../middleware/async.middleware.js";
import Appointment from "../models/appointment.model.js";

export const createAppointment = asyncHandler(async (req, res) => {
  try {
    const { doctor, patientName, phone, age, reason, date, time } = req.body;

    if (!doctor || !patientName || !phone || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // block past date
    const today = new Date();
    const selectedDate = new Date(date);

    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot book past date",
      });
    }

    // block past time if today
    if (date === new Date().toISOString().split("T")[0]) {
      const now = new Date();
      const [h, m] = time.split(":").map(Number);

      const slotDate = new Date();
      slotDate.setHours(h, m, 0);

      if (slotDate < now) {
        return res.status(400).json({
          success: false,
          message: "Cannot book past time slot",
        });
      }
    }

    // check double booking
    const exists = await Appointment.findOne({
      doctor,
      date,
      time,
      status: { $ne: "cancelled" },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked",
      });
    }

    const appointment = await Appointment.create({
      doctor,
      patientName,
      phone,
      age,
      reason,
      date,
      time,
    });

    return res.json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (err) {
    console.error(err);

    // duplicate index protection
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export const getAppointmentsByDoctor = asyncHandler(async (req, res) => {
  const { doctor, date } = req.query;

  if (!doctor || !date) {
    return res.status(400).json({
      success: false,
      message: "Doctor and date are required",
    });
  }

  const appointments = await Appointment.find({
    doctor,
    date,
    status: { $ne: "cancelled" },
  }).select("time");

  res.json({
    success: true,
    data: appointments,
  });
});

// repeat
export const getAppointments = asyncHandler(async (req, res) => {
  const { doctor, date } = req.query;

  const filter = {};

  if (doctor) filter.doctor = doctor;
  if (date) filter.date = date;

  const appointments = await Appointment.find(filter)
    .populate("doctor", "name department specialty")
    .sort({ date: 1, time: 1 });

  res.json({
    success: true,
    data: appointments,
  });
});

export const getTodayAppointments = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const appointments = await Appointment.find({
    date: today,
    status: { $ne: "cancelled" },
  })
    .populate("doctor", "name department")
    .sort({ time: 1 });

  res.json({
    success: true,
    data: appointments,
  });
});