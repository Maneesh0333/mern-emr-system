import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import InputField from "../Shared/InputField";
import Button from "../Shared/Button";
import { useEffect } from "react";
import {
  useCreateReceptionist,
  useUpdateReceptionist,
  type Receptionist,
} from "../../hooks/Admin/useReceptionists";

// --------------------------- Yup Schemas ---------------------------
const createReceptionistSchema = yup.object({
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

const updateReceptionistSchema = yup.object({
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
export type CreateReceptionistForm = yup.InferType<
  typeof createReceptionistSchema
>;
export type UpdateReceptionistForm = yup.InferType<
  typeof updateReceptionistSchema
>;

type FormData = CreateReceptionistForm | UpdateReceptionistForm;

type Props = {
  receptionist?: Receptionist | null;
  closeSheet: () => void;
};

// --------------------------- Component ---------------------------
export default function ReceptionistForm({ receptionist, closeSheet }: Props) {
  const createMutation = useCreateReceptionist();
  const updateMutation = useUpdateReceptionist();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid, isDirty, dirtyFields },
  } = useForm<FormData>({
    resolver: yupResolver(
      receptionist ? updateReceptionistSchema : createReceptionistSchema,
    ),
    mode: "onChange",
  });

  useEffect(() => {
    if (receptionist) {
      reset({
        name: receptionist.name,
        email: receptionist.email,
        department: receptionist.department,
        phone: receptionist.phone || "",
      });
    } else {
      reset({
        name: "",
        email: "",
        password: "",
        department: "",
        phone: "",
      });
    }
  }, [receptionist, reset]);

  const onSubmit = (data: FormData) => {
    if (receptionist) {
      const dataMod = Object.fromEntries(
        Object.entries(data).filter(([key]) =>
          Object.keys(dirtyFields).includes(key),
        ),
      );

      updateMutation.mutate(
        { id: receptionist._id, dataMod },
        {
          onSuccess: () => {
            reset();
            closeSheet();
          },
        },
      );
    } else {
      createMutation.mutate(data as CreateReceptionistForm, {
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
          placeholder="Jane Doe"
          inputClassName="!px-3 !py-2 text-sm"
        />

        <InputField
          label="Email"
          name="email"
          register={register}
          errors={errors}
          placeholder="receptionist@hospital.com"
          inputClassName="!px-3 !py-2 text-sm"
        />

        {!receptionist && (
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
          placeholder="Front Desk / Admissions"
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
        label={receptionist ? "Update Receptionist" : "Create Receptionist"}
        disabled={!isValid || !isDirty}
        isLoading={
          receptionist ? updateMutation.isPending : createMutation.isPending
        }
      />
    </form>
  );
}
