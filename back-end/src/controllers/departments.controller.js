import { asyncHandler } from "../middleware/async.middleware.js";
import User from "../models/User.model.js";

export const getDepartments = asyncHandler(async (req, res) => {
  const departments = await User.distinct("department", {
    role: "DOCTOR",
    status: "Active",
    department: { $ne: "" },
  });

  res.json({
    success: true,
    data: departments,
  });
});
