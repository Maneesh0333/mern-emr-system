import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";

export type Appointment = {
  _id: string;
  patientName: string;
  phone: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  doctor: {
    name: string;
    department: string;
  };
};

type ApiResponse = {
  success: boolean;
  data: Appointment[];
};

export const useDoctorAppointments = () => {
  return useQuery({
    queryKey: ["doctor-appointments"],

    queryFn: async () => {
      const { data } = await axiosApi.get<ApiResponse>(
        "/doctor/appointments"
      );
      return data.data;
    },

    initialData: [],
  });
};