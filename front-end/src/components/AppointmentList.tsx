import { useTodayAppointments } from "../hooks/Receptionists/useAppointments";

export default function TodayAppointments() {
  const { data: appointments = [], isLoading } = useTodayAppointments();

  if (isLoading) {
    return <p className="p-5">Loading...</p>;
  }

  return (
    <div className="p-5 flex-1">
      <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>

      {appointments.length === 0 ? (
        <div className="flex items-center justify-center text-center py-10 h-full text-gray-500">
          No appointments scheduled for today
        </div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Patient</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Doctor</th>
              <th className="p-2">Department</th>
              <th className="p-2">Time</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((a: any) => (
              <tr key={a._id} className="border-t">
                <td className="p-2">{a.patientName}</td>
                <td className="p-2">{a.phone}</td>
                <td className="p-2">{a.doctor?.name}</td>
                <td className="p-2">{a.doctor?.department}</td>
                <td className="p-2">{a.time}</td>
                <td className="p-2">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}