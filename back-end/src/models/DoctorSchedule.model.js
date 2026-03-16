import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    day: {
      type: String,
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    start: {
      type: Number, // minutes from midnight
      required: true,
      min: 0,
      max: 1440, // 24*60
    },
    end: {
      type: Number, // minutes from midnight
      required: true,
      min: 0,
      max: 1440,
    },
    slot: {
      type: Number,
      min: 5,
      max: 60,
      required: true,
    },
    working: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true },
);

// Prevent duplicate schedules for the same doctor/day
scheduleSchema.index({ doctor: 1, day: 1 }, { unique: true });

// Ensure start < end
scheduleSchema.pre("save", function () {
  if (this.start >= this.end) {
    return next(new Error("Start time must be before end time"));
  }
});

const DoctorSchedule = mongoose.model("DoctorSchedule", scheduleSchema);
export default DoctorSchedule;
