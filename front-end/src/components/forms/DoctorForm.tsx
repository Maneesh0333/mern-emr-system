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

// --------------------------- Yup Schemas ---------------------------
const createDoctorSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name can be 50 characters max"),

  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Invalid email format")
    .min(5, "Email must be at least 5 characters")
    .max(50, "Email can be 50 characters max"),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password can be 100 characters max"),

  specialty: yup
    .string()
    .trim()
    .required("Specialty is required")
    .min(2, "Specialty must be at least 2 characters")
    .max(50, "Specialty can be 50 characters max"),

  department: yup
    .string()
    .trim()
    .required("Department is required")
    .min(2, "Department must be at least 2 characters")
    .max(50, "Department can be 50 characters max"),

  phone: yup
    .string()
    .trim()
    .required("Phone number is required")
    .matches(/^[0-9]{10,15}$/, "Phone number must be 10–15 digits"),
});

const updateDoctorSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name can be 50 characters max"),

  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Invalid email format")
    .min(5, "Email must be at least 5 characters")
    .max(50, "Email can be 50 characters max"),

  specialty: yup
    .string()
    .trim()
    .required("Specialty is required")
    .min(2, "Specialty must be at least 2 characters")
    .max(50, "Specialty can be 50 characters max"),

  department: yup
    .string()
    .trim()
    .required("Department is required")
    .min(2, "Department must be at least 2 characters")
    .max(50, "Department can be 50 characters max"),

  phone: yup
    .string()
    .trim()
    .required("Phone number is required")
    .matches(/^[0-9]{10,15}$/, "Phone number must be 10–15 digits"),
});

// --------------------------- Types ---------------------------
export type CreateDoctorForm = yup.InferType<typeof createDoctorSchema>;
export type UpdateDoctorForm = yup.InferType<typeof updateDoctorSchema>;

type FormData = CreateDoctorForm | UpdateDoctorForm;

type Props = {
  doctor?: Doctor | null;
  closeSheet: () => void;
};

// --------------------------- DoctorForm Component ---------------------------
export default function DoctorForm({ doctor, closeSheet }: Props) {
  const createMutation = useCreateDoctor();
  const updateMutation = useUpdateDoctor();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid, isDirty, dirtyFields },
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
        phone: doctor.phone,
      });
    } else {
      reset({
        name: "",
        email: "",
        password: "",
        department: "",
        specialty: "",
        phone: "",
      });
    }
  }, [doctor, reset]);

  const onSubmit = (data: FormData) => {
    if (doctor) {
      const dataMod = Object.fromEntries(
        Object.entries(data).filter(([key]) =>
          Object.keys(dirtyFields).includes(key),
        ),
      );

      updateMutation.mutate(
        { id: doctor._id, dataMod },
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
            placeholder="Enter a secure password"
            register={register}
            errors={errors}
            inputClassName="!px-3 !py-2 text-sm"
          />
        )}

        <InputField
          label="Department"
          name="department"
          placeholder="Cardiology / Pediatrics"
          register={register}
          errors={errors}
          inputClassName="!px-3 !py-2 text-sm"
        />

        <InputField
          label="Specialty"
          name="specialty"
          placeholder="Heart Failure / Neonatology"
          register={register}
          errors={errors}
          inputClassName="!px-3 !py-2 text-sm"
        />

        <InputField
          label="Phone Number"
          name="phone"
          register={register}
          errors={errors}
          placeholder="0123456789"
          inputClassName="!px-3 !py-2 text-sm"
        />
      </div>

      <Button
        type="submit"
        label={doctor ? "Update Doctor" : "Create Doctor"}
        disabled={!isValid || !isDirty}
        isLoading={doctor ? updateMutation.isPending : createMutation.isPending}
      />
    </form>
  );
}
