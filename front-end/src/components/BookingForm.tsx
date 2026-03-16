import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useCreateAppointment } from "../hooks/Receptionists/useCreateAppointment";
import InputField from "./Shared/InputField";
import Button from "./Shared/Button";
import type { Doctor } from "../hooks/Receptionists/useDoctors";
import type { DoctorSlot } from "../hooks/Receptionists/useDoctorSchedule ";

const bookingSchema = yup.object({
  patientName: yup
    .string()
    .required("Patient name is required")
    .min(2, "Minimum 2 characters"),

  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^[0-9]{10,15}$/, "Phone number must be 10-15 digits"),

  age: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .typeError("Age must be a valid number")
    .required("Age is required")
    .min(0, "Age cannot be negative")
    .max(120, "Age seems invalid"),

  reason: yup
    .string()
    .required("Reason is required")
    .min(2, "Minimum 2 characters")
    .max(50, "Miximum 50 characters"),
});

export type BookingFormData = yup.InferType<typeof bookingSchema>;

type Props = {
  doctor: Doctor;
  slot: DoctorSlot;
  date: string;
  onClose: () => void;
};

export default function BookingForm({ doctor, slot, date, onClose }: Props) {
  const { mutate, isPending } = useCreateAppointment();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<BookingFormData>({
    resolver: yupResolver(bookingSchema),
    mode: "onChange",
  });

  const onSubmit = (data: BookingFormData) => {
    const dateMod = new Date(date);

    const [hour, minute] = slot.slotTime.split(":").map(Number);
    dateMod.setHours(hour, minute, 0, 0);
    const appointmentTime = dateMod.toISOString();

    mutate(
      {
        doctor: doctor._id,
        appointmentTime,
        department: doctor.department,
        age: data.age,
        patientName: data.patientName,
        phone: data.phone,
        reason: data.reason,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-full justify-between"
    >
      {/* Appointment Info */}
      <div className="flex text-sm flex-col border border-[var(--border-1)] p-3 rounded-2xl">
        <div>
          <span className="font-medium">Date:</span> {date}
        </div>
        <div>
          <span className="font-medium">Time:</span> {slot.slotTime}
        </div>
        <div>
          <span className="font-medium">Doctor:</span> {doctor.name}
        </div>
      </div>

      <InputField
        label="Patient Name"
        type="text"
        placeholder="Enter patient name"
        name="patientName"
        register={register}
        errors={errors}
        inputClassName="!px-3 !py-2 text-sm"
      />

      <InputField
        label="Phone"
        type="text"
        placeholder="Enter phone number"
        name="phone"
        register={register}
        errors={errors}
        inputClassName="!px-3 !py-2 text-sm"
      />

      <InputField
        label="Age"
        type="number"
        placeholder="Enter age"
        name="age"
        register={register}
        errors={errors}
        inputClassName="!px-3 !py-2 text-sm"
      />

      <div className="flex flex-col">
        <label className="text-xs font-semibold tracking-wide text-[var(--clay)]">
          Reason for Visit
        </label>
        <textarea
          {...register("reason")}
          placeholder="Reason for visit"
          className="mt-2 border border-[var(--border-1)] px-3 py-2 rounded-2xl resize-none focus:border-[var(--clay)] outline-none"
        />
        {errors.reason && (
          <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>
        )}
      </div>

      {/* Buttons */}

      <Button
        type="submit"
        label="Confirm Booking"
        disabled={!isValid}
        isLoading={isPending}
      />
    </form>
  );
}
