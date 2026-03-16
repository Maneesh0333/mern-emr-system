import User from "../models/User.model.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import bcrypt from "bcryptjs";
import Appointment from "../models/appointment.model.js";

export const createReceptionist = asyncHandler(async (req, res) => {
  const { name, email, phone, password, department } = req.body;

  const existingReceptionist = await User.findOne({ email });

  if (existingReceptionist) {
    throw new AppError("Receptionist already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    department,
    role: "RECEPTIONIST",
  });

  res.status(201).json({
    success: true,
    message: "Receptionist created successfully",
  });
});

export const getReceptionists = asyncHandler(async (req, res) => {
  const { status = "All", page = 1, limit = 5, search = "" } = req.query;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.max(parseInt(limit), 1);
  const skip = (pageNum - 1) * limitNum;

  const baseMatch = {
    role: "RECEPTIONIST",
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
        receptionists: [
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
              phone: 1,
              createdAt: 1,
            },
          },
        ],

        totalFiltered: [{ $match: filteredMatch }, { $count: "count" }],

        stats: [
          { $match: baseMatch }, // only role filter
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ],

        totalReceptionists: [{ $match: baseMatch }, { $count: "count" }],
      },
    },
  ]);

  const receptionists = result[0].receptionists;

  const totalFiltered = result[0].totalFiltered[0]?.count || 0;
  const totalReceptionists = result[0].totalReceptionists[0]?.count || 0;

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
      receptionists,
      stats,
      page: pageNum,
      limit: limitNum,
      total: totalFiltered,
      totalReceptionists,
      totalPages: Math.ceil(totalFiltered / limitNum),
      results: receptionists.length,
    },
  });
});

export const enableReceptionist = asyncHandler(async (req, res) => {
  const receptionist = await User.findById(req.params.id);

  if (!receptionist) {
    throw new AppError("Receptionist not found", 404);
  }

  receptionist.status = "Active";
  await receptionist.save();

  res.status(200).json({
    success: true,
    message: "Receptionist Enabled successfully",
  });
});

export const disableReceptionist = asyncHandler(async (req, res) => {
  const receptionist = await User.findById(req.params.id);

  if (!receptionist) {
    throw new AppError("Receptionist not found", 404);
  }

  receptionist.status = "Inactive";
  await receptionist.save();

  res.status(200).json({
    success: true,
    message: "Receptionist Disabled successfully",
  });
});

export const updateReceptionist = asyncHandler(async (req, res) => {
  const allowedFields = ["name", "email", "department", "phone"];

  if (!Object.keys(req.body).length) {
    throw new AppError("No field is provided for update", 400);
  }

  const updateData = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowedFields.includes(key)),
  );

  if (!Object.keys(updateData).length) {
    throw new AppError("No valid fields provided for update", 400);
  }

  const receptionist = await User.findByIdAndUpdate(req.params.id, updateData, {
    runValidators: true,
    new: true,
  });

  if (!receptionist) {
    throw new AppError("Receptionist not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Receptionist updated successfully",
  });
});

export const getReceptionistDashboard = asyncHandler(async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const [totalToday, waiting, completed, cancelled] = await Promise.all([
    Appointment.countDocuments({
      appointmentTime: { $gte: start, $lte: end },
    }),

    Appointment.countDocuments({
      appointmentTime: { $gte: start, $lte: end },
      status: "scheduled",
    }),

    Appointment.countDocuments({
      appointmentTime: { $gte: start, $lte: end },
      status: "completed",
    }),

    Appointment.countDocuments({
      appointmentTime: { $gte: start, $lte: end },
      status: "cancelled",
    }),
  ]);

  res.json({
    success: true,
    data: {
      todayAppointments: totalToday,
      waiting,
      completed,
      cancelled,
    },
  });
});
