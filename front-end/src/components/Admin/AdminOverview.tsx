import QuickActions from "../Shared/QuickActions";
import StatsGrid, { type StatCard } from "../Shared/StatsGrid";
import { useAdminDashboard } from "../../hooks/Admin/useAdminDashboard";
import Spinner from "../Shared/Spinner";

export type statsDataType = {
  icon: string;
  label: string;
  value: string;
  change: string;
  sub: string;
};

export type QuickAction = {
  icon: string;
  title: string;
  description: string;
  path: string;
};

const adminActions: QuickAction[] = [
  {
    icon: "👨‍⚕️",
    title: "Manage Doctors",
    description: "View and manage doctors",
    path: "/admin/doctors",
  },
  {
    icon: "📅",
    title: "Appointments",
    description: "View all appointments",
    path: "/admin/appointments",
  },
  {
    icon: "👩‍💼",
    title: "Receptionists",
    description: "Manage reception staff",
    path: "/admin/receptionists",
  },
];

export default function AdminOverview() {
  const {
    data,
    isLoading,
  } = useAdminDashboard();

  const statsData: StatCard[] = [
    {
      icon: "👨‍⚕️",
      label: "Doctors",
      value: data?.doctors ?? 0,
      change: "",
      sub: "Registered doctors",
    },
    {
      icon: "🧑‍🤝‍🧑",
      label: "Patients",
      value: data?.patients ?? 0,
      change: "",
      sub: "Total patients",
    },
    {
      icon: "📅",
      label: "Today's Appointments",
      value: data?.todayAppointments,
      sub: "Appointments today",
    },
    {
      icon: "✅",
      label: "Completed",
      value: data?.completedAppointments ?? 0,
      sub: "Completed appointments",
    },
  ];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF5ED] text-[#2C1A0E]">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">Admin Dashboard</div>
          <div className="text-sm text-[#6B4A2D]">
            Monitor hospital activity and system health
          </div>
        </div>

        <button className="px-4 py-2 rounded-lg bg-[#C4632A] text-white text-sm font-semibold">
          Generate Report
        </button>
      </div>

      {/* STATS */}
      <StatsGrid statsData={statsData} />

      {/* Quick Actions */}
      <QuickActions actions={adminActions} />
    </div>
  );
}
