import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    day: { type: String, required: true },
    start: String,
    end: String,
    slot: Number,
    working: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const DoctorSchedule = mongoose.model("DoctorSchedule", scheduleSchema);
export default DoctorSchedule;
