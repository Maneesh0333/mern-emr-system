import { useState } from "react";
import {
  useUpdateAppointmentStatus,
  type Appointment,
} from "../../hooks/Admin/useAppointments";
import { useAuthStore } from "../../stores/authStore";
import { ActionButton } from "../Shared/ActionButton";
import SideSheet from "../Shared/SideSheet";
import PrescriptionForm from "../forms/PrescriptionForm";

type Props = {
  item: Appointment;
};

export default function AppointmentsRow({ item }: Props) {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const updateStatus = useUpdateAppointmentStatus();

  const isCompleting =
    updateStatus.isPending &&
    updateStatus.variables?.id === item._id &&
    updateStatus.variables?.status === "completed";

  const isCancelling =
    updateStatus.isPending &&
    updateStatus.variables?.id === item._id &&
    updateStatus.variables?.status === "cancelled";

  return (
    <tr className="border-t border-[var(--border-1)]">
      <td className="px-4 py-4">{item.patientName}</td>
      <td className="px-4 py-4">{item.phone}</td>
      {user?.role !== "DOCTOR" && (
        <>
          <td className="px-4 py-4">{item.doctor?.name}</td>
          <td className="px-4 py-4">{item.doctor?.department}</td>
        </>
      )}
      <td className="px-4 py-4">
        {new Date(item.appointmentTime).toLocaleDateString("en-IN", {
          dateStyle: "short",
        })}
      </td>
      <td className="px-4 py-4">
        {new Date(item.appointmentTime).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </td>

      <td className="px-4 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium ${
            item.status === "scheduled"
              ? "bg-yellow-100 text-yellow-700"
              : item.status === "completed"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          ● {item.status}
        </span>
      </td>

      <td className="px-4 py-4 space-x-2 whitespace-nowrap">
        {item.status === "scheduled" && (
          <>
            <ActionButton
              variant="success"
              isLoading={isCompleting}
              disabled={updateStatus.isPending}
              onClick={() =>
                updateStatus.mutate({
                  id: item._id,
                  status: "completed",
                })
              }
            >
              Complete
            </ActionButton>

            <ActionButton
              variant="danger"
              isLoading={isCancelling}
              disabled={updateStatus.isPending}
              onClick={() =>
                updateStatus.mutate({
                  id: item._id,
                  status: "cancelled",
                })
              }
            >
              Cancel
            </ActionButton>
          </>
        )}

        {user?.role === "DOCTOR" && (
          <>
            <ActionButton variant="primary" onClick={() => setOpen(true)}>
              Prescription
            </ActionButton>

            <SideSheet
              open={open}
              onClose={() => setOpen(false)}
              title="Add Prescription"
              discription="Create medicine reminder schedule"
            >
              <PrescriptionForm
                appointment={item}
                closeSheet={() => setOpen(false)}
              />
            </SideSheet>
          </>
        )}
      </td>
    </tr>
  );
}
