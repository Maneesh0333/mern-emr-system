import { Outlet } from "react-router-dom";
import Sidebar from "../components/Shared/Sidebar";

export type SidebarNavItem = {
  id: string;
  icon: string;
  label: string;
  path: string;
  badge?: string;
};

export type SidebarNavSection = {
  title: string;
  items: SidebarNavItem[];
};

// Sidebar nav items for Admin
export const sidebarNav: SidebarNavSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        id: "dashboard",
        icon: "📊",
        label: "Dashboard",
        path: "/admin",
      },
      {
        id: "appointments",
        icon: "✅",
        label: "Appointments",
        path: "/admin/appointments",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        id: "doctors",
        icon: "👥",
        label: "Doctors",
        path: "/admin/doctors",
      },
      {
        id: "receptionists",
        icon: "🧵",
        label: "Receptionists",
        path: "/admin/receptionists",
      },
    ],
  },
];

export default function Admin() {
  return (
    <div className="h-screen flex flex-col bg-[var(--cream)] font-sans text-[#2C1A0E]">
      <div className="flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar sidebarNav={sidebarNav} />

        {/* Main content for nested routes */}
        <Outlet />
      </div>
    </div>
  );
}
