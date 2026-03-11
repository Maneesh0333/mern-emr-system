import { useForm } from "react-hook-form";
import Header from "./Header";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "../components/Shared/InputField";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import axiosApi from "../../lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Verify from "./Verify";
import toast from "react-hot-toast";

const loginSchema = yup.object({
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
});

type PageType = "Login" | "Verify";

type LoginFormType = yup.InferType<typeof loginSchema>;
// ---------------------
// Backend response types
// ---------------------
interface LoginSuccessResponse {
  success: true;
  message: string;
  data: {
    accessToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
      role: string;
    };
  };
}

interface LoginRequiresVerification {
  success: false;
  message: string;
  requiresVerification: true;
  email: string;
}

interface LoginEntrepreneurPending {
  success: false;
  message: string;
  entrepreneurStatus: "PENDING" | "REJECTED";
}

type LoginResponse =
  | LoginSuccessResponse
  | LoginRequiresVerification
  | LoginEntrepreneurPending;

function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore.getState();
  const [page, setPage] = useState<PageType>("Login");
  const [email, setEmail] = useState("");

  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm<LoginFormType>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  // ---------------------
  // Login mutation
  // ---------------------
  const loginMutation = useMutation<LoginResponse, any, LoginFormType>({
    mutationFn: async (formData) => {
      const res = await axiosApi.post("/auth/login", formData);
      return res.data;
    },
    onSuccess: (data) => {
      // 2xx success response
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      login(data.data);
        toast.success(data.message);
        navigate("/redirect");
    },
    onError: (error, variables) => {
      // Network error
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }

      const { status, data } = error.response as {
        status: number;
        data: LoginResponse;
      };

      // Handle backend errors
      switch (status) {
        case 401:
          toast.error(data.message || "Invalid credentials");
          break;
        case 403:
          if ("requiresVerification" in data && data.requiresVerification) {
            toast.error(data.message);
            setPage("Verify");
            setEmail(variables.email);
          } else if ("entrepreneurStatus" in data) {
            toast.error(data.message);
          }
          break;
        case 500:
          toast.error(data.message || "Server error, please try again later");
          break;
        default:
          toast.error(data.message || "Login failed");
      }
    },
  });

  const onSubmit = (formData: LoginFormType) => {
    loginMutation.mutate(formData);
  };

  return (
    <>
      {page === "Login" ? (
        <div>
          {/* Title */}
          <Header
            title="Welcome back"
            description="Sign in to access your orders, messages and saved artisans."
          />

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <InputField
              name="email"
              label="EMAIL"
              placeholder="email@example.com"
              register={register}
              errors={errors}
            />

            {/* Password */}
            <InputField
              name="password"
              label="PASSWORD"
              type="password"
              placeholder="Enter your password"
              register={register}
              errors={errors}
            >
              <div className="text-right mt-2">
                <span className="text-xs text-[var(--clay)] cursor-pointer hover:underline">
                  Forgot password?
                </span>
              </div>
            </InputField>

            {/* Submit */}
            <Button
              type="submit"
              isValid={isValid}
              label="Sign In"
              isLoading={loginMutation.isPending}
            />
          </form>
        </div>
      ) : (
        <Verify email={email} />
      )}
    </>
  );
}

export default Login;
