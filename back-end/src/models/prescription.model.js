import mongoose from "mongoose";

const medicineTimeSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      enum: [
        "morning",
        "afternoon",
        "evening",
        "night",
      ],
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    quantity: {
      type: String,
      required: true,
    },

    beforeFood: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const medicineSchema = new mongoose.Schema(
  {
    medicineName: {
      type: String,
      required: true,
      trim: true,
    },

    dosage: {
      type: String,
      required: true,
      trim: true,
    },

    durationDays: {
      type: Number,
      required: true,
      min: 1,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    times: [medicineTimeSchema],
  },
  { _id: false },
);

const prescriptionSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    patientPhone: {
      type: String,
      required: true,
      trim: true,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    medicines: [medicineSchema],
  },
  { timestamps: true },
);

const Prescription = mongoose.model(
  "Prescription",
  prescriptionSchema,
);

export default Prescription;