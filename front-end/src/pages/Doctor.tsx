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


// Sidebar nav items for Doctor
export const sidebarNav: SidebarNavSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        id: "home",
        icon: "🏠",
        label: "Home",
        path: "/doctor",
      },
      {
        id: "appointments",
        icon: "✅",
        label: "Appointments",
        path: "/doctor/appointments",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        id: "schedule",
        icon: "🕒",
        label: "Schedule",
        path: "/doctor/schedule",
      },
    ],
  },
];

export default function Doctor() {
  return (
    <div className="h-screen flex flex-col bg-[var(--cream)] font-sans text-[#2C1A0E]">
      <div className="flex overflow-hidden">
        <Sidebar
          sidebarNav={sidebarNav}
        />
        <Outlet />
      </div>
    </div>
  );
}