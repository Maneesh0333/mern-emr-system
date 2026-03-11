import { Link } from "react-router-dom";
import type { QuickAction } from "../Admin/AdminOverview";



type QuickActionsProps = {
  actions: QuickAction[];
};

export default function QuickActions({
  actions,
}: QuickActionsProps) {
  return (
    <div className="bg-[var(--earth)] p-4 rounded-xl border border-[rgba(196,99,42,0.12)]">
      <div className="font-semibold mb-3 text-[var(--warm-white)]">
        Admin Actions
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Link
            to={action.path}
            key={action.title}
            className="p-3 border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.06)] rounded-xl hover:bg-[rgba(196,99,42,0.5)] hover:border-[rgba(196,99,42,0.5)] cursor-pointer transition"
          >
            <div className="text-xl">{action.icon}</div>
            <div className="text-sm text-[var(--warm-white)] font-semibold mt-1">
              {action.title}
            </div>
            <div className="text-xs text-[rgba(255,255,255,0.4)]">
              {action.description}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}