import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MongoDB_URL);
    console.log("✅ Connected to DB");
  } catch (err) {
    console.log("❌ Error While Connecting to DB: ", err.message);
    process.exit(1);
  }
};
