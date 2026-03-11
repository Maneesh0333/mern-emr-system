import Table from "../Shared/Table";
import Header from "../Shared/Header";
import { useDoctorAppointments } from "../../hooks/Doctor/useAppointments";
import DoctorAppointmentRow from "./DoctorAppointmentRow";


export default function DoctorAppointments() {
  const { data: appointments = [], isLoading } = useDoctorAppointments();

  if (isLoading) return <p>Loading appointments...</p>;

  return (
    <div className="flex-1 p-6 space-y-6 bg-[#FAF5ED] text-[#2C1A0E]">
      <Header
        title="My Appointments"
        description={`${appointments.length} total appointments`}
      />

      <Table
        headers={[
          "Patient",
          "Phone",
          "Date",
          "Time",
          "Status",
          "Actions",
        ]}
        data={appointments}
        colSpan={6}
        renderRow={(item) => (
          <DoctorAppointmentRow key={item._id} item={item} />
        )}
      />
    </div>
  );
}