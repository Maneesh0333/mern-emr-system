import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import InputField from "../Shared/InputField";
import SelectInput from "../Shared/SelectInput";
import Button from "../Shared/Button";
import { useEffect } from "react";
import {
  useAddOrUpdateSchedule,
  type Schedule,
} from "../../hooks/Admin/useSchedule";

// Days of the week options
const dayOptions = [
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
  { label: "Sunday", value: "Sunday" },
];

// Validation schema
export const scheduleSchema = yup.object({
  day: yup.string().trim().required("Day is required"),
  working: yup.boolean().required("working is required"),
  start: yup.string().trim().notRequired().default(""),
  end: yup.string().trim().notRequired().default(""),
  slot: yup
    .number()
    .notRequired()
    .default(0)
    .min(5, "Minimum 5 minutes")
    .max(180, "Maximum 180 minutes"),
});

export type ScheduleFormData = yup.InferType<typeof scheduleSchema>;

type Props = {
  schedule?: Schedule | null;
  closeSheet: () => void;
};

export default function ScheduleForm({ schedule, closeSheet }: Props) {
  const createupdateMutation = useAddOrUpdateSchedule();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<ScheduleFormData>({
    resolver: yupResolver(scheduleSchema),
    mode: "onChange",
    defaultValues: {
      day: "Monday",
      working: true,
      start: "09:00",
      end: "17:00",
      slot: 30,
    },
  });

  const working = watch("working");

  // Reset form when editing or opening new
  useEffect(() => {
    if (schedule) {
      reset(schedule); // editing an existing schedule
    } else {
      reset({
        day: "Monday",
        working: true,
        start: "09:00",
        end: "17:00",
        slot: 30,
      });
    }
  }, [schedule, reset]);

  const onSubmit = (data: ScheduleFormData) => {
    if (schedule) {
      // Update existing day
      createupdateMutation.mutate(data, {
        onSuccess: () => {
          reset();
          closeSheet();
        },
      });
    } else {
      // Create new day
      createupdateMutation.mutate(data, {
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
        <Controller
          name="day"
          control={control}
          render={({ field, fieldState }) => (
            <SelectInput
              label="Day"
              options={dayOptions}
              value={field.value} // controlled value from react-hook-form
              onChange={field.onChange} // update form state
              error={fieldState.error?.message}
            />
          )}
        />

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Working Day</label>
          <input type="checkbox" {...register("working")} />
          {errors.working && (
            <p className="text-xs text-red-500 mt-1">
              {String(errors.working?.message)}
            </p>
          )}
        </div>

        {working && (
          <>
            <InputField
              label="Start Time"
              type="time"
              {...register("start")}
              errors={errors}
            />
            <InputField
              label="End Time"
              type="time"
              {...register("end")}
              errors={errors}
            />
            <div>
              <label className="text-sm font-medium">Slot Duration</label>
              <select
                {...register("slot")}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-[var(--border-1)]"
              >
                {[15, 20, 30, 45, 60].map((s) => (
                  <option key={s} value={s}>
                    {s} minutes
                  </option>
                ))}
              </select>
              {errors.slot && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.slot.message}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <Button
        type="submit"
        label={schedule ? "Update Schedule" : "Add Schedule"}
        className="w-full"
        disabled={!isValid}
        isLoading={createupdateMutation.isPending}
      />
    </form>
  );
}
