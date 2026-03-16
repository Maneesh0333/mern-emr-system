import * as Yup from "yup";

export const appointmentSchema = Yup.object({
  doctor: Yup.string()
    .trim()
    .required("DoctorId is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid doctor ID"),

  patientName: Yup.string()
    .trim()
    .required("Patient name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),

  phone: Yup.string()
    .trim()
    .required("Phone number is required")
    .matches(/^[0-9]{10,15}$/, "Phone number must be 10 to 15 digits"),

  age: Yup.number()
    .typeError("Age must be a number")
    .required("Age is required")
    .min(0, "Age cannot be negative")
    .max(120, "Age cannot exceed 120"),

  reason: Yup.string()
    .trim()
    .required("Reason is required")
    .min(2, "Reason must be at least 2 characters")
    .max(50, "Reason cannot exceed 50 characters"),

  appointmentTime: Yup.date()
    .typeError("Invalid date")
    .required("Appointment time is required")
    .test(
      "future-time",
      "Appointment must be at least 30 minutes in the future",
      (value) => value && value > new Date(Date.now() + 30 * 60 * 1000),
    ),

  department: Yup.string()
    .trim()
    .min(2, "Department must be at least 2 characters")
    .max(50, "Department cannot exceed 50 characters")
    .required("Department is required"),
}).noUnknown(true, "Unknown fields are not allowed");
