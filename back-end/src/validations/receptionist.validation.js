import * as yup from "yup";

export const createReceptionistSchema = yup
  .object({
    name: yup
      .string()
      .trim()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name can be 50 characters max"),

    email: yup
      .string()
      .trim()
      .required("Email is required")
      .email("Invalid email format")
      .min(5, "Email must be at least 5 characters")
      .max(50, "Email can be 50 characters max"),

    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password can be 100 characters max"),

    department: yup
      .string()
      .trim()
      .required("Department is required")
      .min(2, "Department must be at least 2 characters")
      .max(50, "Department can be 50 characters max"),

    phone: yup
      .string()
      .trim()
      .required("Phone number is required")
      .matches(/^[0-9]{10,15}$/, "Phone number must be 10–15 digits"),
  })
  .noUnknown(true, "Unknown fields are not allowed");

export const updateReceptionistSchema = yup
  .object({
    name: yup
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name can be 50 characters max"),

    email: yup
      .string()
      .trim()
      .email("Invalid email format")
      .min(5, "Email must be at least 5 characters")
      .max(50, "Email can be 50 characters max"),

    department: yup
      .string()
      .trim()
      .min(2, "Department must be at least 2 characters")
      .max(50, "Department can be 50 characters max"),

    phone: yup
      .string()
      .trim()
      .matches(/^[0-9]{10,15}$/, "Phone number must be 10–15 digits"),
  })
  .noUnknown(true, "Unknown fields are not allowed");
