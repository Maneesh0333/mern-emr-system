import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Admin from "./pages/Admin";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/Shared/ProtectedRoute";
import AdminOverview from "./components/Admin/AdminOverview";
import Doctors from "./components/Admin/Doctors";
import Receptionists from "./components/Admin/Receptionists";
import AvailabilityCalendar from "./components/Admin/AvailabilityCalendar";
import Schedule from "./components/Admin/Schedule";
import RoleRedirect from "./components/Shared/RoleRedirect";
import Doctor from "./pages/Doctor";
import Receptionist from "./pages/Receptionist";
import Scheduler from "./components/Shared/Scheduler";
import AppointmentList from "./components/AppointmentList";
import ReceptionistDashboard from "./components/ReceptionistDashboard";
import Appointments from "./components/Admin/Appointments";
import DoctorAppointments from "./components/Doctor/DoctorAppointments";
import DoctorDashboard from "./components/Doctor/DoctorDashboard";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <RoleRedirect />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="SUPER_ADMIN">
        <Admin />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminOverview />,
      },
      {
        path: "appointments",
        element: <Appointments />,
      },
      {
        path: "doctors",
        element: <Doctors />,
      },
      {
        path: "receptionists",
        element: <Receptionists />,
      },
    ],
  },
  {
    path: "/receptionist",
    element: (
      <ProtectedRoute requiredRole="RECEPTIONIST">
        <Receptionist />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <ReceptionistDashboard />,
      },
      {
        path: "schedule",
        element: <Scheduler />,
      },
      {
        path: "appointments",
        element: <AppointmentList />,
      },
    ],
  },
  {
    path: "/doctor",
    element: (
      <ProtectedRoute requiredRole="DOCTOR">
        <Doctor />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DoctorDashboard />,
      },
      {
        path: "appointments",
        element: <DoctorAppointments />,
      },
      {
        path: "schedule",
        element: <Schedule />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" reverseOrder={false} />
    </QueryClientProvider>
  </StrictMode>,
);
