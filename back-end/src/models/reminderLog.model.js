import mongoose from "mongoose";

const reminderLogSchema = new mongoose.Schema(
  {
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      required: true,
    },

    medicineName: {
      type: String,
      required: true,
      trim: true,
    },

    timeLabel: {
      type: String,
      enum: [
        "morning",
        "afternoon",
        "evening",
        "night",
      ],
      required: true,
    },

    reminderDate: {
      type: String,
      required: true,
    },

    reminderTime: {
      type: Date,
      required: true,
    },

    channel: {
      type: String,
      enum: ["sms", "whatsapp"],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "sent",
        "failed",
      ],
      default: "pending",
    },
  },
  { timestamps: true },
);


// STRICT DUPLICATE PREVENTION

reminderLogSchema.index(
  {
    prescription: 1,
    medicineName: 1,
    timeLabel: 1,
    reminderDate: 1,
  },
  { unique: true },
);

const ReminderLog = mongoose.model(
  "ReminderLog",
  reminderLogSchema,
);

export default ReminderLog;