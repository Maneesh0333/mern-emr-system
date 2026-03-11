import { asyncHandler } from "../middleware/async.middleware.js";
import DoctorSchedule from "../models/DoctorSchedule.model.js";

// Get all schedules for logged-in doctor
export const getSchedule = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const schedule = await DoctorSchedule.find({ doctor: doctorId }).sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    message: "Schedules fetched successfully",
    data: schedule
  });
});


// Add or update a schedule
export const addOrUpdateSchedule = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const { day, start="", end="", slot=0, working } = req.body;

  // Check if day already exists for this doctor
  let record = await DoctorSchedule.findOne({ doctor: doctorId, day });

  if (record) {
    // Update existing day
    record.start = start;
    record.end = end;
    record.slot = slot;
    record.working = working;
    await record.save();
  } else {
    // Create new day
    record = await DoctorSchedule.create({
      doctor: doctorId,
      day,
      start,
      end,
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
