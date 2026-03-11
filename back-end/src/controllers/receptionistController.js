import User from "../models/User.model.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import bcrypt from "bcryptjs";

export const createReceptionist = asyncHandler(async (req, res) => {
  const { name, email, password, department = "" } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new AppError("Name, Email and Password are required");
  }

  const existingReceptionist = await User.findOne({ email });

  if (existingReceptionist) {
    throw new AppError("Receptionist already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
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

  const matchStage = {
    role: "RECEPTIONIST",
  };

  if (status !== "All") {
    matchStage.status = status;
  }

  if (search) {
    matchStage.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { department: { $regex: search, $options: "i" } },
    ];
  }

  const pipeline = [];

  pipeline.push({ $match: matchStage });

  pipeline.push({
    $facet: {
      receptionists: [
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNum },

        {
          $project: {
            name: 1,
            email: 1,
            department: 1,
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

      totalReceptionists: [{ $count: "count" }],
    },
  });

  const result = await User.aggregate(pipeline);

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
  const { name, department = "", status = "Active" } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Receptionist name is required");
  }

  const receptionist = await User.findById(req.params.id);

  if (!receptionist) {
    throw new AppError("Receptionist not found", 404);
  }

  receptionist.name = name;
  receptionist.department = department;
  receptionist.status = status;

  await receptionist.save();

  res.status(200).json({
    success: true,
    message: "Receptionist Updated successfully",
  });
});

