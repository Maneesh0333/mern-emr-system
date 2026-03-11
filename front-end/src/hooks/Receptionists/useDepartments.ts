import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";


type DepartmentsResponse = {
  success: boolean;
  data: string[];
};

export const useDepartments = () => {
  return useQuery<string[]>({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data } = await axiosApi.get<DepartmentsResponse>("/departments");
      return data.data ?? [];
    },
    initialData: [],
  });
};