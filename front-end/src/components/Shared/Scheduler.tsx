import { useState } from "react";
import { useDepartments } from "../../hooks/Receptionists/useDepartments";
import { useDoctors } from "../../hooks/Receptionists/useDoctors";
import { useDoctorSchedule } from "../../hooks/Receptionists/useDoctorSchedule ";
import BookingModal from "../BookingModal";
import { useAppointments } from "../../hooks/Receptionists/useAppointments";

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${
    h >= 12 ? "PM" : "AM"
  }`;
}

export default function Scheduler() {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  const { data: departments = [] } = useDepartments();
  const { data: doctors = [] } = useDoctors(selectedDepartment);
  const { data: schedule } = useDoctorSchedule(selectedDoctor, selectedDate);
  const { data: appointments = [] } = useAppointments(
    selectedDoctor,
    selectedDate,
  );

  const doctor = doctors.find((d: any) => d._id === selectedDoctor);

  function isPastSlot(time: string) {
    const today = getTodayStr();

    if (selectedDate !== today) return false;

    const now = new Date();
    const [h, m] = time.split(":").map(Number);

    const slotDate = new Date();
    slotDate.setHours(h, m, 0);

    return slotDate < now;
  }

  function generateSlots() {
    if (!schedule || !schedule.start || !schedule.end) return [];

    const { start, end, slot } = schedule;

    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    let current = sh * 60 + sm;
    const endMin = eh * 60 + em;

    const slots: any[] = [];

    while (current + slot <= endMin) {
      const h = Math.floor(current / 60);
      const m = current % 60;

      const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

      const booked = appointments.some((a: any) => a.time === time);

      slots.push({
        time,
        label: formatTime(time),
        status: booked ? "booked" : "available",
      });

      current += slot;
    }

    return slots;
  }

  const slots = generateSlots();

  return (
    <div className="space-y-6 flex-1 p-5">
      <h2 className="text-xl font-semibold">Appointment Scheduler</h2>

      {/* Filters */}
      <div className="grid grid-cols-3 gap-4">
        {/* Department */}
        <select
          value={selectedDepartment}
          onChange={(e) => {
            setSelectedDepartment(e.target.value);
            setSelectedDoctor("");
          }}
          className="border p-2 rounded"
        >
          <option value="">All Departments</option>

          {departments.map((dep: string) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>

        {/* Doctor */}
        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Doctor</option>

          {doctors.map((doc: any) => (
            <option key={doc._id} value={doc._id}>
              {doc.name}
            </option>
          ))}
        </select>

        {/* Date */}
        <input
          type="date"
          value={selectedDate}
          min={getTodayStr()}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {!selectedDoctor && (
        <div className="text-center text-gray-400 py-20">
          Select a doctor to view available slots
        </div>
      )}

      {/* Slots */}
      {selectedDoctor && schedule && (
        <div className="grid grid-cols-4 gap-3">
          {slots.map((slot) => {
            const past = isPastSlot(slot.time);

            return (
              <button
                key={slot.time}
                disabled={slot.status === "booked" || past}
                onClick={() => setSelectedSlot(slot)}
                className={`p-3 rounded border text-sm

    ${
      slot.status === "booked"
        ? "bg-red-300 cursor-not-allowed"
        : past
          ? "bg-gray-200"
          : "bg-green-500 text-white hover:bg-green-600"
    }
  `}
              >
                {slot.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Booking */}
      {selectedSlot && doctor && schedule && (
        <BookingModal
          doctor={doctor}
          slot={selectedSlot}
          date={selectedDate}
          duration={schedule.slot}
          onClose={() => setSelectedSlot(null)}
        />
      )}
    </div>
  );
}
