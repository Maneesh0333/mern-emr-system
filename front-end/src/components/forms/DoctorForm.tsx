import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import InputField from "../Shared/InputField";
import Button from "../Shared/Button";
import { useEffect } from "react";
import {
  useCreateDoctor,
  useUpdateDoctor,
  type Doctor,
} from "../../hooks/Admin/useDoctors";

const createDoctorSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
  department: yup.string().required("Department required"),
  specialty: yup.string().required("Specialty required"),
});

const updateDoctorSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email required"),
  department: yup.string().required("Department required"),
  specialty: yup.string().required("Specialty required"),
});

export type CreateDoctorForm = yup.InferType<typeof createDoctorSchema>;
export type UpdateDoctorForm = yup.InferType<typeof updateDoctorSchema>;

type FormData = CreateDoctorForm | UpdateDoctorForm;

type Props = {
  doctor?: Doctor | null;
  closeSheet: () => void;
};

export default function DoctorForm({ doctor, closeSheet }: Props) {
  const createMutation = useCreateDoctor();
  const updateMutation = useUpdateDoctor();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(doctor ? updateDoctorSchema : createDoctorSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (doctor) {
      reset({
        name: doctor.name,
        email: doctor.email,
        department: doctor.department,
        specialty: doctor.specialty,
      });
    } else {
      reset({
        name: "",
        email: "",
        password: "",
        department: "",
        specialty: "",
      });
    }
  }, [doctor, reset]);

  const onSubmit = (data: FormData) => {
    if (doctor) {
      updateMutation.mutate(
        { id: doctor._id, data },
        {
          onSuccess: () => {
            reset();
            closeSheet();
          },
        },
      );
    } else {
      createMutation.mutate(data as CreateDoctorForm, {
        onSuccess: () => {
          reset();
          closeSheet();
        },
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-full justify-between"
    >
      <div className="flex flex-col gap-3">
        <InputField
          label="Full Name"
          name="name"
          register={register}
          errors={errors}
          placeholder="Dr John"
          inputClassName="!px-3 !py-2 text-sm"
        />

        <InputField
          label="Email"
          name="email"
          register={register}
          errors={errors}
          placeholder="doctor@hospital.com"
          inputClassName="!px-3 !py-2 text-sm"
        />

        {!doctor && (
          <InputField
            label="Password"
            name="password"
            type="password"
            register={register}
            errors={errors}
            inputClassName="!px-3 !py-2 text-sm"
          />
        )}

        <InputField
          label="Department"
          name="department"
          register={register}
          errors={errors}
          inputClassName="!px-3 !py-2 text-sm"
        />

        <InputField
          label="Specialty"
          name="specialty"
          register={register}
          errors={errors}
          inputClassName="!px-3 !py-2 text-sm"
        />
      </div>

      <Button
        type="submit"
        label={doctor ? "Update Doctor" : "Create Doctor"}
        disabled={!isValid}
        isLoading={doctor ? updateMutation.isPending : createMutation.isPending}
      />
    </form>
  );
}
