import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

import axiosApi from "../../lib/axios";
import type {
  CreateReceptionistForm,
  UpdateReceptionistForm,
} from "../../components/forms/ReceptionistForm";

export type Receptionist = {
  _id: string;
  name: string;
  email: string;
  department: string;
  status: "Active" | "Inactive";
  createdAt: string;
};

export type ReceptionistsStats = {
  Active: number;
  Inactive: number;
};

type ReceptionistsResponse = {
  receptionists: Receptionist[];
  stats: ReceptionistsStats;
  page: number;
  limit: number;
  total: number;
  totalReceptionists: number;
  totalPages: number;
  results: number;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: ReceptionistsResponse;
};

type ResponseType = {
  success: boolean;
  message: string;
};

export const useReceptionists = (status: string, search: string) => {
  return useQuery({
    queryKey: ["receptionists", status, search],

    queryFn: async () => {
      const { data } = await axiosApi.get<ApiResponse>(
        "/receptionist/receptionists",
        { params: { status, search } },
      );

      const res = data.data;

      return {
        page: res.page ?? 1,
        limit: res.limit ?? 5,
        total: res.total ?? 0,
        totalReceptionists: res.totalReceptionists ?? 0,
        totalPages: res.totalPages ?? 1,
        results: res.results ?? 0,
        stats: res.stats ?? { Active: 0, Inactive: 0 },
        receptionists: res.receptionists ?? [],
      };
    },

    initialData: {
      page: 1,
      limit: 5,
      total: 0,
      totalReceptionists: 0,
      totalPages: 1,
      results: 0,
      stats: { Active: 0, Inactive: 0 },
      receptionists: [],
    },
  });
};

export const useDisableReceptionist = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, string>({
    mutationFn: async (id) => {
      const { data } = await axiosApi.patch<ResponseType>(
        `/receptionist/receptionists/${id}/disable`,
      );
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to disable receptionist");
        return;
      }

      toast.success(data.message ?? "Receptionist disabled");
      queryClient.invalidateQueries({ queryKey: ["receptionists"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error. Please try again.");
        return;
      }

      toast.error(
        error.response.data?.message ?? "Failed to disable receptionist",
      );
    },
  });
};

export const useEnableReceptionist = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, string>({
    mutationFn: async (id) => {
      const { data } = await axiosApi.patch<ResponseType>(
        `/receptionist/receptionists/${id}/enable`,
      );
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to enable receptionist");
        return;
      }

      toast.success(data.message ?? "Receptionist enabled");
      queryClient.invalidateQueries({ queryKey: ["receptionists"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error. Please try again.");
        return;
      }

      toast.error(
        error.response.data?.message ?? "Failed to enable receptionist",
      );
    },
  });
};

export const useCreateReceptionist = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    CreateReceptionistForm
  >({
    mutationFn: async (formData) => {
      const res = await axiosApi.post<ResponseType>(
        "/receptionist/receptionists",
        formData,
      );
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to create receptionist");
        return;
      }

      toast.success(data.message ?? "Receptionist created.");
      queryClient.invalidateQueries({ queryKey: ["receptionists"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }

      toast.error(
        error.response.data?.message ?? "Failed to create receptionist",
      );
    },
  });
};

export const useUpdateReceptionist = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    { id: string; data: UpdateReceptionistForm }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await axiosApi.patch<ResponseType>(
        `/receptionist/receptionists/${id}`,
        data,
      );
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to update receptionist");
        return;
      }

      toast.success(data.message ?? "Receptionist updated");
      queryClient.invalidateQueries({ queryKey: ["receptionists"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }

      toast.error(
        error.response?.data?.message ?? "Failed to update receptionist",
      );
    },
  });
};
