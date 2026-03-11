import type { UseMutationResult } from "@tanstack/react-query";
import { ActionButton } from "../Shared/ActionButton";
import type { Receptionist } from "../../hooks/Admin/useReceptionists";

type Props = {
  item: Receptionist;
  disableMutation: UseMutationResult<any, Error, string>;
  enableMutation: UseMutationResult<any, Error, string>;
  onEdit: (doctor: Receptionist) => void;
};

export default function ReceptionistsRow({
  item,
  disableMutation,
  enableMutation,
  onEdit,
}: Props) {
  const isBlocking =
    disableMutation.isPending && disableMutation.variables === item._id;

  const isUnblocking =
    enableMutation.isPending && enableMutation.variables === item._id;

  return (
    <tr className="border-t border-[var(--border-1)]">
      <td className="px-4 py-4">{item.name}</td>
      <td className="px-4 py-4">{item.email}</td>
      <td className="px-4 py-4">{item.department}</td>

      <td className="px-4 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium ${
            item.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          ● {item.status}
        </span>
      </td>

      <td className="px-4 py-4">
        {new Date(item.createdAt).toLocaleDateString()}
      </td>

      <td className="px-4 py-4 space-x-2 whitespace-nowrap">
        <ActionButton variant="warning" onClick={() => onEdit(item)}>
          Edit
        </ActionButton>

        {item.status === "Active" ? (
          <ActionButton
            variant="danger"
            isLoading={isBlocking}
            onClick={() => disableMutation.mutate(item._id)}
          >
            Disable
          </ActionButton>
        ) : (
          <ActionButton
            variant="success"
            isLoading={isUnblocking}
            onClick={() => enableMutation.mutate(item._id)}
          >
            Enable
          </ActionButton>
        )}
      </td>
    </tr>
  );
}
