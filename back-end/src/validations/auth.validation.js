import * as yup from "yup";

export const loginSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .email("Invalid email format")
      .required("Email is required")
      .transform((value) => value.toLowerCase()),

    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Za-z]/, "Password must contain at least one letter")
      .matches(/[0-9]/, "Password must contain at least one number"),
  })
  .noUnknown(true, "Unknown fields are not allowed");

