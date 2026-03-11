import * as yup from "yup";

export const createDoctorSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters"),

  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),

  specialty: yup
    .string()
    .required("specialty is required"),

  department: yup
    .string()
    .required("Department is required"),
});