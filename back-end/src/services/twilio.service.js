import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();


const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_TOKEN = process.env.TWILIO_TOKEN;

if (!TWILIO_SID || !TWILIO_TOKEN) {
  throw new Error("TWILIO_SID or TWILIO_TOKEN is not defined in environment variables");
}

const client = twilio(TWILIO_SID, TWILIO_TOKEN);

export const sendWhatsAppReminder = async ({ to, body }) => {
  const formattedPhone = to.startsWith("+91") ? to : `+91${to}`;

  return client.messages.create({
    from: "whatsapp:+14155238886",
    to: `whatsapp:${formattedPhone}`,
    body,
  });
};
