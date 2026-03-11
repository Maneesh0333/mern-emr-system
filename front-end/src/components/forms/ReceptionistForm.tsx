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
import {
  useCreateReceptionist,
  useUpdateReceptionist,
  type Receptionist,
} from "../../hooks/Admin/useReceptionists";

const createReceptionistSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
  department: yup.string().required("Department required"),
});

const updateReceptionistSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email required"),
  department: yup.string().required("Department required"),
});

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

export default function ReceptionistForm({ receptionist, closeSheet }: Props) {
  const createMutation = useCreateReceptionist();
  const updateMutation = useUpdateReceptionist();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
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
      });
    } else {
      reset({
        name: "",
        email: "",
        password: "",
        department: "",
      });
    }
  }, [receptionist, reset]);

  const onSubmit = (data: FormData) => {
    if (receptionist) {
      updateMutation.mutate(
        { id: receptionist._id, data },
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

        {!receptionist && (
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
      </div>

      <Button
        type="submit"
        label={receptionist ? "Update Doctor" : "Create Doctor"}
        disabled={!isValid}
        isLoading={
          receptionist ? updateMutation.isPending : createMutation.isPending
        }
      />
    </form>
  );
}
