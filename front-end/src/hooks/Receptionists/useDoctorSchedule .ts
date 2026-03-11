import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";

export type DoctorSchedule = {
  _id: string;
  day: string;
  start: string;
  end: string;
  slot: number;
  working: boolean;
};

type DoctorScheduleResponse = {
  success: boolean;
  message: string;
  data: DoctorSchedule | null;
};

export const useDoctorSchedule = (doctorId?: string, date?: string) => {
  return useQuery<DoctorSchedule | null>({
    queryKey: ["doctor-schedule", doctorId, date],

    queryFn: async () => {
      const { data } = await axiosApi.get<DoctorScheduleResponse>(
        `/doctor/${doctorId}`,
        {
          params: { date },
        }
      );

      return data.data ?? null;
    },

    enabled: !!doctorId,
  });
};