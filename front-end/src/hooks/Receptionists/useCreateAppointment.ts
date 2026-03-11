import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";

type AppointmentPayload = {
  doctor: string;
  patientName: string;
  phone: string;
  age?: number;
  reason?: string;
  date: string;
  time: string;
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AppointmentPayload) => {
      const { data } = await axiosApi.post("/appointments", payload);
      return data;
    },

    onSuccess: () => {
      // refresh appointments if you have list
      queryClient.invalidateQueries(["appointments"]);
    },
  });
};