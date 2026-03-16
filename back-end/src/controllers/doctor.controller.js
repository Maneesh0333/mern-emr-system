import { asyncHandler } from "../middleware/async.middleware.js";
import Appointment from "../models/appointment.model.js";
import DoctorAvailability from "../models/DoctorAvailability.model.js";
import DoctorSchedule from "../models/DoctorSchedule.model.js";
import User from "../models/User.model.js";
import { minutesToTime } from "../utils/MinutesToTime.js";
import { minutesFromMidnight } from "../utils/minutesFromMidnight.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcryptjs";
import { timeToMinutes } from "../utils/TimeToMinutes.js";

export const getDoctorSchedule = asyncHandler(async (req, res) => {
  const doctorId = req.params.id;
  const { date } = req.query;

  if (!doctorId) {
    return res.status(400).json({
      success: false,
      message: "Doctor ID is required",
    });
  }

  const targetDate = date ? new Date(date) : new Date();

  const dayName = targetDate.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const dayStart = new Date(targetDate);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(targetDate);
  dayEnd.setHours(23, 59, 59, 999);

  const schedule = await DoctorSchedule.findOne({
    doctor: doctorId,
    day: dayName,
    working: true,
  }).select("start end slot");

  if (!schedule) {
    return res.status(200).json({
      success: false,
      message: "Doctor is not working on this day",
      data: [],
    });
  }

  const { start, end, slot } = schedule;

  const appointments = await Appointment.find({
    doctor: doctorId,
    appointmentTime: {
      $gte: dayStart,
      $lte: dayEnd,
    },
  });

  const bookedSlots = appointments.map((a) =>
    minutesFromMidnight(new Date(a.appointmentTime)),
  );

  const bookedSet = new Set(bookedSlots);

  const data = [];
  let currentTime = start;

  while (currentTime < end) {
    data.push({
      slotTime: minutesToTime(currentTime),
      booked: bookedSet.has(currentTime),
    });

    currentTime += slot;
  }

  res.status(200).json({
    success: true,
    message: "Schedule fetched successfully",
    data,
  });
});

export const getAvailableDoctors = asyncHandler(async (req, res) => {
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
    message: "Doctors fetched.",
    data: doctors,
  });
});

export const getDoctorDashboard = async (req, res) => {
  const doctorId = req.user.id;

  const today = new Date().toISOString().split("T")[0];

  const appointments = await Appointment.find({
    doctor: doctorId,
    date: today,
  });

  const total = appointments.length;

  const scheduled = appointments.filter((a) => a.status === "scheduled").length;

  const completed = appointments.filter((a) => a.status === "completed").length;

  const cancelled = appointments.filter((a) => a.status === "cancelled").length;

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

export const createDoctor = asyncHandler(async (req, res) => {
  const { name, email, password, department = "", specialty = "" } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new AppError("Name, Email and Password are required");
  }

  const existingDoctor = await User.findOne({ email });

  if (existingDoctor) {
    throw new AppError("Doctor already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
    department,
    specialty,
    role: "DOCTOR",
  });

  res.status(201).json({
    success: true,
    message: "Doctor created successfully",
  });
});

export const getAdminDoctors = asyncHandler(async (req, res) => {
  const { status = "All", page = 1, limit = 5, search = "" } = req.query;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.max(parseInt(limit), 1);
  const skip = (pageNum - 1) * limitNum;

  const baseMatch = {
    role: "DOCTOR",
  };

  const filteredMatch = { ...baseMatch };

  if (status !== "All") {
    filteredMatch.status = status;
  }

  if (search) {
    filteredMatch.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { department: { $regex: search, $options: "i" } },
      { specialty: { $regex: search, $options: "i" } },
    ];
  }

  const result = await User.aggregate([
    {
      $facet: {
        doctors: [
          { $match: filteredMatch },
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limitNum },
          {
            $project: {
              name: 1,
              email: 1,
              department: 1,
              specialty: 1,
              status: 1,
              createdAt: 1,
            },
          },
        ],

        totalFiltered: [
          { $match: filteredMatch },
          { $count: "count" },
        ],

        stats: [
          { $match: baseMatch },
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ],

        totalDoctors: [
          { $match: baseMatch },
          { $count: "count" },
        ],
      },
    },
  ]);

  const doctors = result[0].doctors;

  const totalFiltered = result[0].totalFiltered[0]?.count || 0;
  const totalDoctors = result[0].totalDoctors[0]?.count || 0;

  const statsArray = result[0].stats;

  const stats = {
    Active: 0,
    Inactive: 0,
  };

  statsArray.forEach((s) => {
    stats[s._id] = s.count;
  });

  res.status(200).json({
    success: true,
    message: "Fetched Successfully",
    data: {
      doctors,
      stats,
      page: pageNum,
      limit: limitNum,
      total: totalFiltered,
      totalDoctors,
      totalPages: Math.ceil(totalFiltered / limitNum),
      results: doctors.length,
    },
  });
});

export const enableDoctor = asyncHandler(async (req, res) => {
  const doctor = await User.findById(req.params.id);

  if (!doctor) {
    throw new AppError("Doctor not found", 404);
  }

  doctor.status = "Active";
  await doctor.save();

  res.status(200).json({
    success: true,
    message: "Doctor Enabled successfully",
  });
});

export const disableDoctor = asyncHandler(async (req, res) => {
  const doctor = await User.findById(req.params.id);

  if (!doctor) {
    throw new AppError("Doctor not found", 404);
  }

  doctor.status = "Inactive";
  await doctor.save();

  res.status(200).json({
    success: true,
    message: "Doctor Disabled successfully",
  });
});

export const updateDoctor = asyncHandler(async (req, res) => {
  const { name, department = "", specialty = "", status = "Active" } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Doctor name is required");
  }

  const doctor = await User.findById(req.params.id);

  if (!doctor) {
    throw new AppError("Doctor not found", 404);
  }

  doctor.name = name;
  doctor.department = department;
  doctor.specialty = specialty;
  doctor.status = status;

  await doctor.save();

  res.status(200).json({
    success: true,
    message: "Doctor Updated successfully",
  });
});

export const getSchedule = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;

  const schedules = await DoctorSchedule.find({ doctor: doctorId }).sort({
    createdAt: 1,
  });

  const formattedSchedules = schedules.map((s) => ({
    ...s.toObject(),
    start: minutesToTime(s.start),
    end: minutesToTime(s.end),
  }));

  res.status(200).json({
    success: true,
    message: "Schedules fetched successfully",
    data: formattedSchedules,
  });
});

export const addOrUpdateSchedule = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const { day, start = "09:00", end = "17:00", slot = 0, working } = req.body;

  const startInMinutes = timeToMinutes(start);
  const endInMinutes = timeToMinutes(end);

  // Check if day already exists for this doctor
  let record = await DoctorSchedule.findOne({ doctor: doctorId, day });

  if (record) {
    // Update existing day
    record.start = startInMinutes;
    record.end = endInMinutes;
    record.slot = slot;
    record.working = working;
    await record.save();
  } else {
    // Create new day
    record = await DoctorSchedule.create({
      doctor: doctorId,
      day,
      start: startInMinutes,
      end: endInMinutes,
      slot,
      working,
    });
  }

  res.status(200).json({
    success: true,
    message: record
      ? "Schedule saved successfully"
      : "Schedule added successfully",
  });
});
