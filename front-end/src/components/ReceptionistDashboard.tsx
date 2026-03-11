import { Link } from "react-router-dom";
import { useTodayAppointments } from "../hooks/Receptionists/useAppointments";

export default function ReceptionistDashboard() {
  const { data: appointments = [], isLoading } = useTodayAppointments();

  const total = appointments.length;

  const completed = appointments.filter(
    (a: any) => a.status === "completed",
  ).length;

  const cancelled = appointments.filter(
    (a: any) => a.status === "cancelled",
  ).length;

  const waiting = appointments.filter(
    (a: any) => a.status === "scheduled",
  ).length;

  if (isLoading) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  return (
    <div className="p-6 flex-1 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-semibold">Receptionist Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500 text-sm">Today's Appointments</p>
          <h3 className="text-2xl font-bold">{total}</h3>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500 text-sm">Waiting</p>
          <h3 className="text-2xl font-bold text-yellow-600">{waiting}</h3>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500 text-sm">Completed</p>
          <h3 className="text-2xl font-bold text-green-600">{completed}</h3>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500 text-sm">Cancelled</p>
          <h3 className="text-2xl font-bold text-red-600">{cancelled}</h3>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Link
          to="/receptionist/schedule"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Book Appointment
        </Link>

        <Link
          to="/receptionist/appointments"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          View Appointments
        </Link>

        <Link
          to="/receptionist/schedule"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Appointment Schedule
        </Link>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white shadow rounded">
        <div className="p-4 border-b font-semibold">Today's Appointments</div>

        {appointments.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No appointments scheduled today
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Patient</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Doctor</th>
                <th className="p-3">Department</th>
                <th className="p-3">Time</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((a: any) => (
                <tr key={a._id} className="border-t">
                  <td className="p-3">{a.patientName}</td>
                  <td className="p-3">{a.phone}</td>
                  <td className="p-3">{a.doctor?.name}</td>
                  <td className="p-3">{a.doctor?.department}</td>
                  <td className="p-3">{a.time}</td>

                  <td className="p-3">
                    {a.status === "completed" && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                        Completed
                      </span>
                    )}

                    {a.status === "cancelled" && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                        Cancelled
                      </span>
                    )}

                    {a.status === "scheduled" && (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm">
                        Waiting
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
