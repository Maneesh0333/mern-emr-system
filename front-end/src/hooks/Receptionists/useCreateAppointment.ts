import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

type AppointmentPayload = {
  doctor: string;
  patientName: string;
  phone: string;
  age: number;
  reason: string;
  appointmentTime: string;
  department: string
};

type ResponseType = {
  success: boolean;
  message: string;
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    AppointmentPayload
  >({
    mutationFn: async (payload) => {
      const { data } = await axiosApi.post("/appointments", payload);
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.success(data.message || "Booking Failed.");
        return;
      }
      toast.success(data.message || "Booking Success.");
      queryClient.invalidateQueries({ queryKey: ["doctor-schedule"] });
    },
    onError: (err) => {
      if (!err.response) {
        toast.error("Network error, please try again later.");
      }
      toast.error(err.response?.data.message || "Booking Failed.");
    },
  });
};
