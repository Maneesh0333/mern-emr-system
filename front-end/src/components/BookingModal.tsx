import { useState } from "react";
import { useCreateAppointment } from "../hooks/Receptionists/useCreateAppointment";

export default function BookingModal({
  doctor,
  slot,
  date,
  duration,
  onClose,
}: any) {
  const { mutate, isPending } = useCreateAppointment();

  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    mutate(
      {
        doctor: doctor._id,
        patientName,
        phone,
        age: Number(age),
        reason,
        date,
        time: slot.time,
      },
      {
        onSuccess: () => {
          alert("Appointment booked successfully");
          onClose();
        },
        onError: (err: any) => {
          alert(err.response?.data?.message || "Booking failed");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-[420px] p-6 space-y-4">

        <h2 className="text-lg font-semibold">Book Appointment</h2>

        {/* Appointment Info */}
        <div className="border rounded p-3 text-sm">
          <p><b>Date:</b> {date}</p>
          <p><b>Time:</b> {slot.label}</p>
          <p><b>Doctor:</b> {doctor.name}</p>
          <p><b>Duration:</b> {duration} min</p>
        </div>

        <input
          placeholder="Patient name"
          className="border p-2 rounded w-full"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />

        <input
          placeholder="Phone"
          className="border p-2 rounded w-full"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          placeholder="Age"
          className="border p-2 rounded w-full"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <textarea
          placeholder="Reason for visit"
          className="border p-2 rounded w-full"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            disabled={isPending}
            onClick={handleSubmit}
            className="bg-teal-600 text-white px-4 py-2 rounded"
          >
            {isPending ? "Booking..." : "Confirm Booking"}
          </button>
        </div>

      </div>
    </div>
  );
}