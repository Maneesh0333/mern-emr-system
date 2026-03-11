import express from "express";
import authRoutes from "./routes/auth.routes.js";
import docterRoutes from "./routes/doctor.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import scheduleRoutes from "./routes/schedule.routes.js";

import receptionistRoutes from "./routes/receptionist.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import departmentsRoutes from "./routes/departments.routes.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFound } from "./middleware/notFound.middleware.js";

const app = express();

// Middleware
app.use(express.json({limit: '10kb'}));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", 
    credentials: true,         
  })
);
app.use(cookieParser());
app.use(helmet());

app.use("/auth", authRoutes);
app.use("/doctor", docterRoutes)
app.use("/admin", adminRoutes);
app.use("/schedule", scheduleRoutes);
app.use("/receptionist", receptionistRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/departments", departmentsRoutes);

app.use(notFound);
app.use(errorHandler);
export default app;
