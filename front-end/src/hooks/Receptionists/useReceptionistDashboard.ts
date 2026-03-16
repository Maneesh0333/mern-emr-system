import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";

export type ReceptionistDashboard = {
  todayAppointments: number;
  waiting: number;
  completed: number;
  cancelled: number;
};

type DashboardResponse = {
  success: boolean;
  data: ReceptionistDashboard;
};

export const useReceptionistDashboard = () => {
  return useQuery<ReceptionistDashboard>({
    queryKey: ["receptionist-dashboard"],
    queryFn: async () => {
      const { data } = await axiosApi.get<DashboardResponse>(
        "/receptionists/dashboard",
      );

      return data.data;
    },
  });
};
