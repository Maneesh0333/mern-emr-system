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
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{10,15}$/, "Phone number must be 10 to 15 digits"],
    },

    age: {
      type: Number,
      required: true,
      min: 0,
      max: 120,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    appointmentTime: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value > new Date(),
        message: "Appointment time must be in the future",
      },
    },

    department: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    status: {
      type: String,
      enum: ["scheduled", "cancelled", "completed"],
      default: "scheduled",
    },
  },
  { timestamps: true },
);

appointmentSchema.index({ doctor: 1, appointmentTime: 1 }, { unique: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
