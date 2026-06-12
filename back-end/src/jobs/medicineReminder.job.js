import cron from "node-cron";
import Prescription from "../models/prescription.model.js";
import ReminderLog from "../models/reminderLog.model.js";
import { sendWhatsAppReminder } from "../services/twilio.service.js";

// EVERY MINUTE
cron.schedule("* * * * *", async () => {
  console.log("Corn is runing...");

  try {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const today = now.toISOString().split("T")[0];

    // ACTIVE PRESCRIPTIONS ONLY
    const prescriptions = await Prescription.find({
      medicines: {
        $elemMatch: {
          startDate: {
            $lte: now,
          },
          endDate: {
            $gte: now,
          },
        },
      },
    });

    for (const prescription of prescriptions) {
      for (const medicine of prescription.medicines) {
        // SKIP EXPIRED MEDICINE
        if (now < medicine.startDate || now > medicine.endDate) {
          continue;
        }

        for (const t of medicine.times) {
          // TIME CHECK
          if (t.time !== currentTime) {
            continue;
          }

          // DUPLICATE CHECK
          const alreadySent = await ReminderLog.findOne({
            prescription: prescription._id,
            medicineName: medicine.medicineName,
            timeLabel: t.label,
            reminderDate: today,
            status: "sent",
          });

          if (alreadySent) {
            continue;
          }

          // MESSAGE
          const body = `
💊 MEDICINE REMINDER

Hello ${prescription.patientName},

It's time to take your medicine.

━━━━━━━━━━━━━━━

💊 Medicine
${medicine.medicineName}

📦 Dosage
${medicine.dosage}

🔢 Quantity
${t.quantity}

⏰ Schedule
${t.label} (${t.time})

🍽️ Instruction
${t.beforeFood ? "Before Food" : "After Food"}

━━━━━━━━━━━━━━━

Please take your medicine as prescribed by your doctor.

🏥 Stay healthy!
`;

          try {
            await sendWhatsAppReminder({
              to: prescription.patientPhone,
              body,
            });

            await ReminderLog.create({
              prescription: prescription._id,
              medicineName: medicine.medicineName,
              timeLabel: t.label,
              reminderDate: today,
              reminderTime: new Date(),
              channel: "whatsapp",
              status: "sent",
            });

            console.log(`Reminder sent to ${prescription.patientName}`);
          } catch (err) {
            console.log(err);

            await ReminderLog.create({
              prescription: prescription._id,
              medicineName: medicine.medicineName,
              timeLabel: t.label,
              reminderDate: today,
              reminderTime: new Date(),
              channel: "whatsapp",
              status: "failed",
            });
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
});
