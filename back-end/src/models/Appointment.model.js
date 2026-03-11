import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    patientName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    age: Number,

    reason: String,

    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },

    time: {
      type: String, // HH:mm
      required: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "cancelled", "completed"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

// prevent double booking
appointmentSchema.index(
  { doctor: 1, date: 1, time: 1 },
  { unique: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;