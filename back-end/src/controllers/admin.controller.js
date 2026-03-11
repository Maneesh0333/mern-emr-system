import { asyncHandler } from "../middleware/async.middleware.js";
import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import AppError from "../utils/AppError.js";
import Appointment from "../models/appointment.model.js";


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

export const getDoctors = asyncHandler(async (req, res) => {
  const { status = "All", page = 1, limit = 5, search = "" } = req.query;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.max(parseInt(limit), 1);
  const skip = (pageNum - 1) * limitNum;

  const matchStage = {
    role: "DOCTOR",
  };

  if (status !== "All") {
    matchStage.status = status;
  }

  if (search) {
    matchStage.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { department: { $regex: search, $options: "i" } },
      { specialty: { $regex: search, $options: "i" } },
    ];
  }

  const pipeline = [];

  pipeline.push({ $match: matchStage });

  pipeline.push({
    $facet: {
      doctors: [
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

      stats: [
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ],

      totalFiltered: [{ $count: "count" }],

      totalDoctors: [{ $count: "count" }],
    },
  });

  const result = await User.aggregate(pipeline);

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

export const getAppointments = asyncHandler(async (req, res) => {
  const { status = "All", search = "" } = req.query;

  const match = {};

  if (status !== "All") match.status = status;

  if (search) {
    match.$or = [
      { patientName: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const appointments = await Appointment.find(match)
    .populate("doctor", "name department")
    .sort({ date: -1, time: -1 });

  const totalAppointments = await Appointment.countDocuments(match);

  res.json({
    success: true,
    data: {
      appointments,
      totalAppointments,
      stats: {
        scheduled: await Appointment.countDocuments({ status: "scheduled" }),
        completed: await Appointment.countDocuments({ status: "completed" }),
        cancelled: await Appointment.countDocuments({ status: "cancelled" }),
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
    { new: true }
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