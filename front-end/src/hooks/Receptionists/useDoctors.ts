import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";


export type Doctor = {
  _id: string;
  name: string;
  department: string;
  specialty: string;
};

type DoctorsResponse = {
  success: boolean;
  data: Doctor[];
};

export const useDoctors = (department?: string) => {
  return useQuery({
    queryKey: ["doctors", department],
    queryFn: async () => {
      const { data } = await axiosApi.get<DoctorsResponse>("/doctor", {
        params: { department },
      });

      return data.data ?? [];
    },
    initialData: [],
  });
};