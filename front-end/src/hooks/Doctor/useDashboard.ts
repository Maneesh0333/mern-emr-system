import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";

type Dashboard = {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
};

export const useDoctorDashboard = () => {
  return useQuery({
    queryKey: ["doctor-dashboard"],
    queryFn: async () => {
      const { data } = await axiosApi.get("/doctor/dashboard");
      return data.data as Dashboard;
    },
  });
};