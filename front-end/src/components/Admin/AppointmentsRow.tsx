import {
  useUpdateAppointmentStatus,
  type Appointment,
} from "../../hooks/Admin/useAppointments";
import { ActionButton } from "../Shared/ActionButton";

type Props = {
  item: Appointment;
};

export default function AppointmentsRow({ item }: Props) {
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
      <td className="px-4 py-4">{item.doctor?.name}</td>
      <td className="px-4 py-4">{item.doctor?.department}</td>
      <td className="px-4 py-4">{item.date}</td>
      <td className="px-4 py-4">{item.time}</td>

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
              isLoading={
                updateStatus.isPending &&
                updateStatus.variables?.id === item._id &&
                updateStatus.variables?.status === "completed"
              }
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
              isLoading={
                updateStatus.isPending &&
                updateStatus.variables?.id === item._id &&
                updateStatus.variables?.status === "cancelled"
              }
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
      </td>
    </tr>
  );
}
