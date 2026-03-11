import type { statsDataType } from "./StatsGrid";

export default function StatsCard({
  icon,
  label,
  value,
  change,
  sub,
}: statsDataType) {
  return (
    <div className="p-4 rounded-xl bg-white border border-[rgba(196,99,42,0.12)]">
      <div className="text-xl">{icon}</div>

      <div className="text-xs text-[var(--earth-mid)] uppercase font-semibold mt-1">
        {label}
      </div>

      <div className="text-2xl font-bold mt-1">{value}</div>

      <div className="text-xs text-[var(--sage)] mt-1">{change}</div>

      <div className="text-xs text-[var(--earth-mid)] mt-1">{sub}</div>
    </div>
  );
}
