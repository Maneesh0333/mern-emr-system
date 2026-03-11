import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";

export const useAppointments = (doctorId?: string, date?: string) => {
  return useQuery({
    queryKey: ["appointments", doctorId, date],
    queryFn: async () => {
      const { data } = await axiosApi.get(
        `/appointments?doctor=${doctorId}&date=${date}`
      );

      return data.data ?? [];
    },
    enabled: !!doctorId && !!date,
  });
};


export const useAppointmentsAll = (date?: string) => {
  return useQuery({
    queryKey: ["appointments", date],
    queryFn: async () => {
      const { data } = await axiosApi.get(
        `/appointments${date ? `?date=${date}` : ""}`
      );

      return data.data ?? [];
    },
  });
};


export const useTodayAppointments = () => {
  return useQuery({
    queryKey: ["appointments-today"],
    queryFn: async () => {
      const { data } = await axiosApi.get("/appointments/today");
      return data.data ?? [];
    },
  });
};