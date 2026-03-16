import StatsGrid, { type StatCard } from "./Shared/StatsGrid";
import QuickActions from "./Shared/QuickActions";
import Header from "./Shared/Header";
import { useReceptionistDashboard } from "../hooks/Receptionists/useReceptionistDashboard";
import Spinner from "./Shared/Spinner";

const receptionistActions = [
  {
    icon: "📅",
    title: "Book Appointment",
    description: "Schedule a new appointment",
    path: "/receptionist/schedule",
  },
  {
    icon: "👀",
    title: "View Appointments",
    description: "Check all appointments",
    path: "/receptionist/appointments",
  },
  {
    icon: "🗓️",
    title: "Appointment Schedule",
    description: "View schedule",
    path: "/receptionist/schedule",
  },
];

export default function ReceptionistDashboard() {
  const { data: dashboardStats, isLoading } = useReceptionistDashboard();

  const statsData: StatCard[] = [
    {
      icon: "📅",
      label: "Appointments",
      value: dashboardStats?.todayAppointments?? 0,
      sub: "Todays Appointments",
    },
    {
      icon: "⏳",
      label: "Waiting",
      value: dashboardStats?.waiting?? 0,
      sub: "Today Waiting",
    },
    {
      icon: "✅",
      label: "Completed",
      value: dashboardStats?.completed?? 0,
      sub: "Today Completed",
    },
    {
      icon: "❌",
      label: "Cancelled",
      value: dashboardStats?.cancelled?? 0,
      sub: "Today Cancelled",
    },
  ];

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="flex-1 p-6 space-y-6 bg-[#FAF5ED] overflow-y-auto">
      <Header title="Receptionist Dashboard" />

      <StatsGrid statsData={statsData} />

      <QuickActions actions={receptionistActions} />
    </div>
  );
}
