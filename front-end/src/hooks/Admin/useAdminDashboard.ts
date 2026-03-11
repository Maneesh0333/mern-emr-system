import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";

type DashboardStats = {
  doctors: number;
  patients: number;
  todayAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  scheduledAppointments: number;
};

type ApiResponse = {
  success: boolean;
  data: {
    stats: DashboardStats;
  };
};

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin-dashboard"],

    queryFn: async () => {
      const { data } = await axiosApi.get<ApiResponse>("/admin/dashboard");
      return data.data.stats;
    },
  });
};