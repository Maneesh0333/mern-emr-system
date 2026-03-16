import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useAuthStore, type User } from "../../stores/authStore";
import { useMutation } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";
import toast from "react-hot-toast";
import Header from "./Header";
import InputField from "../Shared/InputField";
import Button from "./Button";
import type { AxiosError } from "axios";

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

type LoginFormType = yup.InferType<typeof loginSchema>;

type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: User
  };
};

function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore.getState();

  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm<LoginFormType>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const loginMutation = useMutation<LoginResponse, AxiosError<LoginResponse>, LoginFormType>({
    mutationFn: async (formData) => {
      const res = await axiosApi.post<LoginResponse>("/auth/login", formData);
      return res.data;
    },

    onSuccess: (data) => {
      if(!data.success){
        toast.error(data.message || "Login failed");
        return;
      }
      login(data.data); 
      toast.success(data.message || "Login success");
      navigate("/");
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error");
        return;
      }

      toast.error(error.response.data.message || "Login failed");
    },
  });

  const onSubmit = (formData: LoginFormType) => {
    loginMutation.mutate(formData);
  };

  return (
    <>
      <div>
        {/* Title */}
        <Header
          title="Welcome back"
          description="Sign in to your clinical workspace."
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
    </>
  );
}

export default Login;
