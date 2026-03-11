import { asyncHandler } from "../middleware/async.middleware.js";
import Appointment from "../models/appointment.model.js";
import DoctorAvailability from "../models/DoctorAvailability.model.js";
import DoctorSchedule from "../models/DoctorSchedule.model.js";
import User from "../models/User.model.js";

export const getDoctorSchedule = asyncHandler(async (req, res) => {
  const doctorId = req.params.id;
  const { date } = req.query;

  if (!doctorId) {
    return res.status(400).json({
      success: false,
      message: "Doctor ID is required",
    });
  }

  // If no date → use today
  const targetDate = date ? new Date(date) : new Date();

  const dayName = targetDate.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const schedule = await DoctorSchedule.findOne({
    doctor: doctorId,
    day: dayName,
    working: true,
  }).select("day start end slot working");

  res.status(200).json({
    success: true,
    message: "Schedule fetched successfully",
    data: schedule,
  });
});


// GET unavailable dates for a doctor
export const getAvailability = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;

  const availability = await DoctorAvailability.findOne({ doctor: doctorId });

  return res.json({
    success: true,
    message: "Availability fetched successfully",
    data: availability?.unavailableDates ?? [],
  });
});

// UPDATE unavailable dates
export const updateAvailability = async (req, res) => {
  const doctorId = req.user.id;
  const { unavailableDates } = req.body; // expect an array of ISO strings

  if (!Array.isArray(unavailableDates)) {
    return res
      .status(400)
      .json({ success: false, message: "unavailableDates must be an array" });
  }

  try {
    const availability = await DoctorAvailability.findOneAndUpdate(
      { doctor: doctorId },
      { unavailableDates },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return res.json({
      success: true,
      message: "Availability updated successfully",
      data: availability.unavailableDates,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getDoctors = asyncHandler(async (req, res) => {
  try {
    const { department = "All" } = req.query;

    const filter = {
      role: "DOCTOR",
      status: "Active",
    };

    if (department && department !== "All") {
      filter.department = department;
    }

    const doctors = await User.find(filter).select(
      "_id name department specialty",
    );

    res.json({
      success: true,
      data: doctors,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


export const getDoctorAppointments = async (req, res) => {
  const doctorId = req.user.id;

  const appointments = await Appointment.find({ doctor: doctorId })
    .populate("doctor", "name department")
    .sort({ date: 1, time: 1 });

  res.json({
    success: true,
    data: appointments,
  });
};

export const getDoctorDashboard = async (req, res) => {
  const doctorId = req.user.id;

  const today = new Date().toISOString().split("T")[0];

  const appointments = await Appointment.find({
    doctor: doctorId,
    date: today,
  });

  const total = appointments.length;

  const scheduled = appointments.filter(
    (a) => a.status === "scheduled"
  ).length;

  const completed = appointments.filter(
    (a) => a.status === "completed"
  ).length;

  const cancelled = appointments.filter(
    (a) => a.status === "cancelled"
  ).length;

  res.json({
    success: true,
    data: {
      total,
      scheduled,
      completed,
      cancelled,
    },
  });
};