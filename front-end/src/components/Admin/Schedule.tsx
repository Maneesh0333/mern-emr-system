import { useState } from "react";
import Header from "../Shared/Header";
import SideSheet from "../Shared/SideSheet";
import Button from "../Shared/Button";
import ScheduleForm from "../forms/ScheduleForm";
import { useSchedules, type Schedule } from "../../hooks/Admin/useSchedule";

export default function Schedule() {
  const [open, setOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null,
  );

  const { data, isLoading, isError } = useSchedules();

  const schedule = data;

  // Calculate number of slots
  const calculateSlots = (start?: string, end?: string, slot?: number) => {
    if (!start || !end || !slot) return 0;
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    return Math.floor((eh * 60 + em - (sh * 60 + sm)) / slot);
  };

  // Open form to edit a schedule
  const handleEdit = (item: Schedule) => {
    setSelectedSchedule(item);
    setOpen(true);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading Schedule</p>;

  return (
    <div className="flex-1 p-6 bg-[var(--cream)] rounded-xl space-y-6 text-[var(--earth)]">
      {/* Header */}
      <Header
        title="My Schedule"
        description="Weekly working hours and slot configuration"
        children={
          <Button
            label="+ Add Schedule"
            onClick={() => {
              setSelectedSchedule(null);
              setOpen(true);
            }}
          />
        }
      />

      {/* Schedule Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {schedule.map((item) => {
          const slots =
            item.start && item.end && item.slot
              ? calculateSlots(item.start, item.end, item.slot)
              : 0;
          return (
            <div
              key={item.day}
              className="bg-[var(--white)] border border-[var(--border-1)] rounded-xl p-5 flex flex-col gap-4 cursor-pointer"
              onClick={() => handleEdit(item)}
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">{item.day}</h2>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    item.working
                      ? "bg-green-100 text-green-500"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {item.working ? "Working" : "Off"}
                </span>
              </div>

              {item.working && (
                <div className="flex gap-10 text-sm">
                  <div>
                    <p className="text-xs text-[var(--earth-light)]">Hours</p>
                    <p className="font-semibold">
                      {item.start} – {item.end}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--earth-light)]">Slot</p>
                    <p className="font-semibold text-[var(--clay)]">
                      {item.slot}m
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--earth-light)]">
                      Capacity
                    </p>
                    <p className="font-semibold">{slots} slots</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SideSheet Form */}
      <SideSheet
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedSchedule(null);
        }}
        title={selectedSchedule ? "Edit Schedule" : "Add Schedule"}
        discription={
          selectedSchedule
            ? "Update working hours and slots"
            : "Fill details to add new schedule"
        }
      >
        <ScheduleForm
          schedule={selectedSchedule}
          closeSheet={() => setOpen(false)}
        />
      </SideSheet>
    </div>
  );
}
