import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

export type Appointment = {
  _id: string;
  patientName: string;
  phone: string;
  appointmentTime: string;
  status: "scheduled" | "completed" | "cancelled";
  doctor: {
    name: string;
    department: string;
  };
};

type AppointmentStats = {
  scheduled: number;
  completed: number;
  cancelled: number;
};

type AppointmentsResponse = {
  appointments: Appointment[];
  stats: AppointmentStats;

  page: number;
  limit: number;
  total: number;
  totalPages: number;
  results: number;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: AppointmentsResponse;
};

export const useAppointments = (
  status: string,
  search: string,
  date: string,
  page: number,
  limit = 5,
) => {
  return useQuery({
    queryKey: ["appointments", status, search, date, page],

    queryFn: async () => {
      const { data } = await axiosApi.get<ApiResponse>("/appointments", {
        params: {
          status,
          search,
          date,
          page,
          limit,
        },
      });

      return data.data;
    },

    placeholderData: (prev) => prev,
  });
};

export type ResponseType = {
  success: boolean;
  message: string;
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    { id: string; status: "completed" | "cancelled" }
  >({
    mutationFn: async ({ id, status }) => {
      const { data } = await axiosApi.patch<ResponseType>(
        `/appointments/${id}/status`,
        { status },
      );
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to update");
        return;
      }

      toast.success(data.message ?? "Appointment updated");

      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["doctor-appointments"],
      });
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Failed to update status");
    },
  });
};
