import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import type { AxiosError } from "axios";

import axiosApi from "../../lib/axios";
import type {
  CreateDoctorForm,
  UpdateDoctorForm,
} from "../../components/forms/DoctorForm";

export type DoctorsStats = {
  Active: number;
  Inactive: number;
};

export type Doctor = {
  _id: string;
  name: string;
  email: string;
  department: string;
  specialty: string;
  status: "Active" | "Inactive";
  createdAt: string;
};

type DoctorsResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  results: number;
  totalDoctors: number;
  stats: DoctorsStats;
  doctors: Doctor[];
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: DoctorsResponse;
};

export const useDoctors = (status: string, search: string) => {
  return useQuery({
    queryKey: ["doctors", status, search],

    queryFn: async () => {
      const { data } = await axiosApi.get<ApiResponse>("/doctors", {
        params: { status, search },
      });

      return data.data;
    },
    placeholderData: (prev)=> prev
  });
};

export type ResponseType = {
  success: boolean;
  message: string;
};

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, CreateDoctorForm>({
    mutationFn: async (formData) => {
      const res = await axiosApi.post<ResponseType>("/doctors", formData);
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to create doctor");
        return;
      }

      toast.success(data.message ?? "Doctor created.");
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }

      toast.error(error.response.data?.message ?? "Failed to create doctor");
    },
  });
};

export const useDisableDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, string>({
    mutationFn: async (id) => {
      const { data } = await axiosApi.patch<ResponseType>(
        `/doctors/${id}/disable`,
      );
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to disable doctor");
        return;
      }

      toast.success(data.message ?? "Doctor disabled");
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }

      toast.error(error.response?.data?.message ?? "Failed to disable doctor");
    },
  });
};

export const useEnableDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, string>({
    mutationFn: async (id) => {
      const { data } = await axiosApi.patch<ResponseType>(
        `/doctors/${id}/enable`,
      );
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to enable doctor");
        return;
      }

      toast.success(data.message ?? "Doctor enabled");
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }

      toast.error(error.response?.data?.message ?? "Failed to enable doctor");
    },
  });
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    { id: string; data: UpdateDoctorForm }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await axiosApi.patch<ResponseType>(`/doctors/${id}`, data);
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to update doctor");
        return;
      }

      toast.success(data.message ?? "Doctor updated");
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }

      toast.error(error.response?.data?.message ?? "Failed to update doctor");
    },
  });
};
