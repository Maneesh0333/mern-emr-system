import StatsGrid from "../Shared/StatsGrid";
import QuickActions from "../Shared/QuickActions";
import { useDoctorDashboard } from "../../hooks/Doctor/useDashboard";

export default function DoctorDashboard() {
  const { data, isLoading } = useDoctorDashboard();

  if (isLoading) return <p>Loading dashboard...</p>;

  const stats = [
    {
      icon: "📅",
      label: "Today's Appointments",
      value: data?.total || 0,
      change: "Patients booked today",
      sub: "Check schedule",
    },
    {
      icon: "⏳",
      label: "Scheduled",
      value: data?.scheduled || "0",
      change: "Waiting patients",
      sub: "Upcoming consultations",
    },
    {
      icon: "✅",
      label: "Completed",
      value: data?.completed || "0",
      change: "Consultations done",
      sub: "Finished today",
    },
    {
      icon: "❌",
      label: "Cancelled",
      value: data?.cancelled || "0",
      change: "Missed appointments",
      sub: "Today cancellations",
    },
  ];

  const actions = [
    {
      icon: "📋",
      title: "View Appointments",
      description: "See today's patients",
      path: "/doctor/appointments",
    },
    {
      icon: "🕒",
      title: "Update Availability",
      description: "Change schedule",
      path: "/doctor/schedule",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF5ED] text-[#2C1A0E]">
      {/* HEADER */}
      <div>
        <div className="text-2xl font-bold">Doctor Dashboard 👨‍⚕️</div>
        <div className="text-sm text-[#6B4A2D]">
          Manage your appointments and schedule
        </div>
      </div>

      {/* STATS */}
      <StatsGrid statsData={stats} />

      {/* QUICK ACTIONS */}
      <QuickActions actions={actions} />
    </div>
  );
}