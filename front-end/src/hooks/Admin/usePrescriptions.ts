import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import type { AxiosError } from "axios";

import axiosApi from "../../lib/axios";

export type MedicineTime = {
  label: string;
  time: string;
  quantity: string;
  beforeFood: boolean;
};

export type Medicine = {
  medicineName: string;
  dosage: string;
  durationDays: number;
  times: MedicineTime[];
};

export type Prescription = {
  _id: string;

  patientName: string;

  patientPhone: string;

  notes: string;

  medicines: Medicine[];

  createdAt: string;
};

type PrescriptionResponse = {
  prescriptions: Prescription[];

  page: number;

  totalPages: number;

  total: number;
};

type ApiResponse = {
  success: boolean;

  message: string;

  data: PrescriptionResponse;
};

export const usePrescriptions = (search: string, page: number) => {
  return useQuery({
    queryKey: ["prescriptions", search, page],

    queryFn: async () => {
      const { data } = await axiosApi.get<ApiResponse>("/prescriptions", {
        params: {
          search,
          page,
          limit: 5,
        },
      });

      return data.data;
    },

    placeholderData: (prev) => prev,
  });
};

export type CreatePrescriptionPayload = {
  appointment: string;

  patientName: string;

  patientPhone: string;

  notes: string;

  medicines: Medicine[];
};

type ResponseType = {
  success: boolean;

  message: string;
};

export const useCreatePrescription = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    CreatePrescriptionPayload
  >({
    mutationFn: async (payload) => {
      const { data } = await axiosApi.post<ResponseType>(
        "/prescriptions",
        payload,
      );

      return data;
    },

    onSuccess: (data) => {
      toast.success(data.message ?? "Prescription added");

      queryClient.invalidateQueries({
        queryKey: ["prescriptions"],
      });
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Failed");
    },
  });
};
