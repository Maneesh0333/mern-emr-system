import { yupResolver } from "@hookform/resolvers/yup";

import { useFieldArray, useForm } from "react-hook-form";

import * as yup from "yup";

import Button from "../Shared/Button";

import InputField from "../Shared/InputField";

import { useCreatePrescription } from "../../hooks/Admin/usePrescriptions";

// ---------------- SCHEMA ----------------

const prescriptionSchema = yup.object({
  notes: yup.string().trim().default(""),

  medicines: yup
    .array()
    .of(
      yup.object({
        medicineName: yup.string().trim().required("Medicine name is required"),

        dosage: yup.string().trim().required("Dosage is required"),

        durationDays: yup
          .number()
          .typeError("Duration is required")
          .required("Duration is required")
          .min(1, "Minimum 1 day"),

        startDate: yup.string().required("Start date is required"),

        times: yup
          .array()
          .of(
            yup.object({
              label: yup.string().required(),

              enabled: yup.boolean().required(),

              time: yup.string().required("Reminder time is required"),

              quantity: yup.string().trim().required("Quantity is required"),

              beforeFood: yup.boolean().required(),
            }),
          )
          .required(),
      }),
    )
    .required(),
});

// ---------------- TYPES ----------------

export type PrescriptionFormData = yup.InferType<typeof prescriptionSchema>;

type Props = {
  appointment: {
    _id: string;

    patientName: string;

    phone: string;
  };

  closeSheet: () => void;
};

// ---------------- COMPONENT ----------------

export default function PrescriptionForm({ appointment, closeSheet }: Props) {
  const createPrescription = useCreatePrescription();

  const {
    register,

    control,

    handleSubmit,

    watch,

    formState: { errors, isValid, isDirty },
  } = useForm<PrescriptionFormData>({
    resolver: yupResolver(prescriptionSchema),

    mode: "onChange",

    defaultValues: {
      notes: "",

      medicines: [
        {
          medicineName: "",

          dosage: "",

          durationDays: 1,

          startDate: new Date().toISOString().split("T")[0],

          times: [
            {
              label: "morning",

              enabled: true,

              time: "08:00",

              quantity: "1 tablet",

              beforeFood: false,
            },

            {
              label: "afternoon",

              enabled: false,

              time: "13:00",

              quantity: "1 tablet",

              beforeFood: false,
            },

            {
              label: "evening",

              enabled: false,

              time: "20:00",

              quantity: "1 tablet",

              beforeFood: false,
            },

            {
              label: "night",

              enabled: false,

              time: "22:00",

              quantity: "1 tablet",

              beforeFood: false,
            },
          ],
        },
      ],
    },
  });

  const {
    fields: medicineFields,

    append,

    remove,
  } = useFieldArray({
    control,

    name: "medicines",
  });

  // ---------------- SUBMIT ----------------

  const onSubmit = (data: PrescriptionFormData) => {
    const cleanedMedicines = data.medicines.map((medicine) => ({
      ...medicine,

      times: medicine.times.filter((t) => t.enabled),
    }));

    console.log(
      {
        appointment: appointment._id,
        patientName: appointment.patientName,
        patientPhone: appointment.phone,
        notes: data.notes,
        medicines: cleanedMedicines,
      },
      "----++----",
    );

    createPrescription.mutate(
      {
        appointment: appointment._id,
        patientName: appointment.patientName,
        patientPhone: appointment.phone,
        notes: data.notes,
        medicines: cleanedMedicines,
      },
      {
        onSuccess: () => {
          closeSheet();
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        flex
        flex-col
        overflow-y-auto
        h-full
        justify-between
      "
      style={{
        scrollbarWidth: "none",
      }}
    >
      <div className="space-y-5 pr-1">
        {/* NOTES */}
        <div className="flex flex-col">
          <label
            className="
              text-sm
              font-medium
              text-[var(--earth)]
            "
          >
            Notes
          </label>

          <textarea
            {...register("notes")}
            rows={4}
            placeholder="Prescription notes..."
            className="
              mt-1
              w-full
              rounded-xl
              border
              border-[rgba(196,99,42,0.2)]
              p-3
              text-sm
              outline-none
              resize-none
            "
          />
        </div>

        {/* MEDICINES */}
        {medicineFields.map((medicine, medIndex) => (
          <div
            key={medicine.id}
            className="
                flex
                flex-col
                rounded-2xl
                border
                border-[rgba(196,99,42,0.2)]
                p-4
                space-y-4
                bg-white
              "
          >
            {/* HEADER */}
            <div
              className="
                  flex
                  items-center
                  justify-between
                "
            >
              <h3
                className="
                    font-semibold
                    text-[var(--earth)]
                  "
              >
                Medicine {medIndex + 1}
              </h3>

              {medicineFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(medIndex)}
                  className="
                      text-red-500
                      text-sm
                      cursor-pointer
                    "
                >
                  Remove
                </button>
              )}
            </div>

            {/* MEDICINE NAME */}
            <InputField
              label="Medicine Name"
              name={`medicines.${medIndex}.medicineName`}
              register={register}
              errors={errors}
              placeholder="Paracetamol"
              inputClassName="
                  !px-3
                  !py-2
                  text-sm
                  !flex
                "
            />

            {/* DOSAGE */}
            <InputField
              label="Dosage"
              name={`medicines.${medIndex}.dosage`}
              register={register}
              errors={errors}
              placeholder="500mg"
              inputClassName="
                  !px-3
                  !py-2
                  text-sm
                  !flex
                "
            />

            {/* DURATION */}
            <InputField
              label="Duration Days"
              name={`medicines.${medIndex}.durationDays`}
              type="number"
              register={register}
              errors={errors}
              placeholder="5"
              inputClassName="
                  !px-3
                  !py-2
                  text-sm
                  !flex
                "
            />

            {/* START DATE */}
            <InputField
              label="Start Date"
              name={`medicines.${medIndex}.startDate`}
              type="date"
              register={register}
              errors={errors}
              inputClassName="
                  !px-3
                  !py-2
                  text-sm
                  !flex
                "
            />

            {/* TIMES */}
            <div className="space-y-3">
              {["morning", "afternoon", "evening", "night"].map(
                (label, timeIndex) => {
                  const enabled = watch(
                    `medicines.${medIndex}.times.${timeIndex}.enabled`,
                  );

                  return (
                    <div
                      key={label}
                      className="
                          rounded-xl
                          border
                          border-[rgba(196,99,42,0.2)]
                          p-3
                          space-y-3
                        "
                    >
                      {/* ENABLE */}

                      <label
                        className="
                            flex
                            items-center
                            gap-2
                            cursor-pointer
                          "
                      >
                        <input
                          type="checkbox"
                          {...register(
                            `medicines.${medIndex}.times.${timeIndex}.enabled`,
                          )}
                        />

                        <span
                          className="
                              font-medium
                              capitalize
                              text-sm
                              text-[var(--earth)]
                            "
                        >
                          {label}
                        </span>
                      </label>

                      {/* HIDDEN LABEL */}

                      <input
                        type="hidden"
                        value={label}
                        {...register(
                          `medicines.${medIndex}.times.${timeIndex}.label`,
                        )}
                      />

                      {/* CONDITIONAL */}

                      {enabled && (
                        <div
                          className="
                              flex
                              flex-col
                              gap-3
                            "
                        >
                          {/* TIME */}

                          <div
                            className="
                                flex
                                flex-col
                              "
                          >
                            <label
                              className="
                                  text-xs
                                  text-[var(--earth-mid)]
                                "
                            >
                              Reminder Time
                            </label>

                            <input
                              type="time"
                              {...register(
                                `medicines.${medIndex}.times.${timeIndex}.time`,
                              )}
                              className="
                                  mt-1
                                  w-full
                                  rounded-xl
                                  border
                                  border-[rgba(196,99,42,0.2)]
                                  p-2
                                  text-sm
                                  outline-none
                                "
                            />
                          </div>

                          {/* QUANTITY */}

                          <div
                            className="
                                flex
                                flex-col
                              "
                          >
                            <label
                              className="
                                  text-xs
                                  text-[var(--earth-mid)]
                                "
                            >
                              Quantity
                            </label>

                            <input
                              type="text"
                              placeholder="
                                  1 tablet
                                "
                              {...register(
                                `medicines.${medIndex}.times.${timeIndex}.quantity`,
                              )}
                              className="
                                  mt-1
                                  w-full
                                  rounded-xl
                                  border
                                  border-[rgba(196,99,42,0.2)]
                                  p-2
                                  text-sm
                                  outline-none
                                "
                            />
                          </div>

                          {/* BEFORE FOOD */}

                          <label
                            className="
                                flex
                                items-center
                                gap-2
                                text-sm
                                cursor-pointer
                              "
                          >
                            <input
                              type="checkbox"
                              {...register(
                                `medicines.${medIndex}.times.${timeIndex}.beforeFood`,
                              )}
                            />
                            Before Food
                          </label>
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </div>
        ))}

        {/* ACTIONS */}

        <div
          className="
            flex
            flex-col
            gap-3
          "
        >
          {/* ADD MEDICINE */}
          <Button
            type="button"
            label="+ Add Medicine"
            className="
              w-full
              border
              border-[var(--clay)]
              bg-transparent
              text-[var(--clay)]!
              hover:text-white!
            "
            onClick={() =>
              append({
                medicineName: "",
                dosage: "",
                durationDays: 1,
                startDate: new Date().toISOString().split("T")[0],
                times: [
                  {
                    label: "morning",
                    enabled: true,
                    time: "08:00",
                    quantity: "1 tablet",
                    beforeFood: false,
                  },

                  {
                    label: "afternoon",
                    enabled: false,
                    time: "13:00",
                    quantity: "1 tablet",
                    beforeFood: false,
                  },

                  {
                    label: "evening",
                    enabled: false,
                    time: "20:00",
                    quantity: "1 tablet",
                    beforeFood: false,
                  },

                  {
                    label: "night",
                    enabled: false,
                    time: "22:00",
                    quantity: "1 tablet",
                    beforeFood: false,
                  },
                ],
              })
            }
          />

          {/* SUBMIT */}
          <Button
            type="submit"
            label="Save Prescription"
            disabled={!isValid || !isDirty}
            isLoading={createPrescription.isPending}
            className="w-full"
          />
        </div>
      </div>
    </form>
  );
}
