import { useState, useEffect } from "react";
import { useDepartments } from "../../hooks/Receptionists/useDepartments";
import { useDoctors, type Doctor } from "../../hooks/Receptionists/useDoctors";
import Header from "./Header";
import SideSheet from "./SideSheet";
import BookingForm from "../BookingForm";
import { useDoctorSchedule } from "../../hooks/Receptionists/useDoctorSchedule ";

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

type Slot = {
  slotTime: string;
  booked: boolean;
};

export default function Scheduler() {
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const { data: departments = [] } = useDepartments();
  const { data: doctors = [] } = useDoctors(selectedDepartment);

  const { data: slots = [] } = useDoctorSchedule(selectedDoctor, selectedDate);

  const doctor = doctors.find((d: Doctor) => d._id === selectedDoctor);

  //  Auto update date at midnight
  useEffect(() => {
    const interval = setInterval(() => {
      const today = getTodayStr();

      setSelectedDate((prev) => {
        if (prev < today) return today;
        return prev;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  //  Check if slot is in the past
  function isPastSlot(slotTime: string) {
    const now = new Date();

    const [hourStr, minStr] = slotTime.split(":");
    const hour = Number(hourStr);
    const minute = Number(minStr);

    const slotDate = new Date(selectedDate);
    slotDate.setHours(hour, minute, 0, 0);

    return slotDate < now;
  }

  //  Group slots by time of day
  function groupSlots(slots: Slot[]) {
    const groups: Record<string, Slot[]> = {
      Morning: [],
      Afternoon: [],
      Evening: [],
    };

    slots.forEach((slot) => {
      const hour = Number(slot.slotTime.split(":")[0]);

      if (hour < 12) groups.Morning.push(slot);
      else if (hour < 17) groups.Afternoon.push(slot);
      else groups.Evening.push(slot);
    });

    return groups;
  }

  const groupedSlots = groupSlots(slots);

  return (
    <div className="flex flex-col space-y-6 flex-1 p-5 overflow-y-auto">
      <Header title="Appointment Scheduler" description="Book Appointment" />

      {/* Filters */}
      <div className="grid grid-cols-3 gap-4">
        <select
          value={selectedDepartment}
          onChange={(e) => {
            setSelectedDepartment(e.target.value);
            setSelectedDoctor("");
          }}
          className="px-3 py-2 rounded-xl border border-[rgba(196,99,42,0.2)]
          focus:outline-none focus:border-[var(--clay)] bg-white"
        >
          <option value="">All Departments</option>

          {departments.map((dep: string) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>

        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          className="px-3 py-2 rounded-xl border border-[rgba(196,99,42,0.2)]
          focus:outline-none focus:border-[var(--clay)] bg-white"
        >
          <option value="">Select Doctor</option>

          {doctors.map((doc: Doctor) => (
            <option key={doc._id} value={doc._id}>
              {doc.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={selectedDate}
          min={getTodayStr()}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 rounded-xl border border-[rgba(196,99,42,0.2)]
          focus:outline-none focus:border-[var(--clay)] bg-white"
        />
      </div>

      {/* No doctor selected */}
      {!selectedDoctor ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 py-20">
          Select a doctor to view available slots
        </div>
      ) : slots.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 py-20">
          Doctor is not working on this day
        </div>
      ) : (
        <>
          {Object.entries(groupedSlots).map(([group, groupSlots]) => {
            if (!groupSlots.length) return null;

            return (
              <div key={group} className="space-y-3">
                <h3 className="font-semibold">{group}</h3>

                <div className="grid grid-cols-4 gap-3">
                  {groupSlots.map((slot) => {
                    const past = isPastSlot(slot.slotTime);

                    let slotClasses =
                      "p-3 rounded-xl border focus:outline-none ";

                    if (slot.booked) {
                      slotClasses +=
                        "bg-red-300 border-red-400 cursor-not-allowed text-white";
                    } else if (past) {
                      slotClasses +=
                        "bg-gray-200 border-gray-300 cursor-not-allowed text-gray-500";
                    } else {
                      slotClasses +=
                        "bg-green-500 border-green-600 text-white hover:bg-green-600 focus:border-green-700";
                    }

                    return (
                      <button
                        key={slot.slotTime}
                        disabled={slot.booked || past}
                        onClick={() => setSelectedSlot(slot)}
                        className={slotClasses}
                      >
                        {slot.slotTime}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* Booking Sheet */}
      {selectedSlot && doctor && (
        <SideSheet
          open={true}
          onClose={() => setSelectedSlot(null)}
          title="Add Appointment"
          discription="Fill details to add appointment"
        >
          <BookingForm
            doctor={doctor}
            date={selectedDate}
            slot={selectedSlot}
            onClose={() => setSelectedSlot(null)}
          />
        </SideSheet>
      )}
    </div>
  );
}
