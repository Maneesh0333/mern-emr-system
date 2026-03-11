import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one availability record per doctor
    },
    unavailableDates: [
      {
        type: String, // ISO date (YYYY-MM-DD)
      },
    ],
  },
  { timestamps: true }
);

const DoctorAvailability = mongoose.model(
  "DoctorAvailability",
  availabilitySchema
);
export default DoctorAvailability;