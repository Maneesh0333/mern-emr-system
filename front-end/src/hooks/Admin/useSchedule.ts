import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import axiosApi from "../../lib/axios";
import type { ScheduleFormData } from "../../components/forms/ScheduleForm";

export type Schedule = {
  _id: string;
  doctor: string; // doctor ID
  day: string;
  start?: string;
  end?: string;
  slot?: number;
  working: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number; // Mongoose version key
};

// API response
export type GetSchedulesResponse = {
  success: boolean;
  message: string;
  data: Schedule[];
};

export type ResponseType = {
  success: boolean;
  message: string;
};

// ---------- Fetch Schedules ----------
export const useSchedules = () => {
  return useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      const { data } = await axiosApi.get<GetSchedulesResponse>("/schedule");
      return data.data ?? [];
    },
    initialData: [],
  });
};

// ---------- Add or Update Schedule ----------
export const useAddOrUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, ScheduleFormData>({
    mutationFn: async (formData) => {
      const { data } = await axiosApi.post<ResponseType>(
        "/schedule", // Your backend route
        formData,
      );
      return data;
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to save schedule");
        return;
      }
      toast.success(data.message ?? "Schedule saved successfully");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, try again later");
        return;
      }
      toast.error(error.response.data?.message ?? "Failed to save schedule");
    },
  });
};
