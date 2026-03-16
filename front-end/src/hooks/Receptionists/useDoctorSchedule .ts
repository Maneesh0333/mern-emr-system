import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";

export type DoctorSlot = {
  slotTime: string;
  booked: boolean;
};

type DoctorScheduleResponse = {
  success: boolean;
  message: string;
  data: DoctorSlot[];
};

export const useDoctorSchedule = (doctorId: string, date: string) => {
  return useQuery<DoctorSlot[]>({
    queryKey: ["doctor-schedule", doctorId, date],

    queryFn: async () => {
      const { data } = await axiosApi.get<DoctorScheduleResponse>(
        `/doctors/${doctorId}/schedule`,
        {
          params: { date },
        }
      );

      return data.data ?? [];
    },

    enabled: !!doctorId && !!date,
  });
};