import { useState, useEffect } from "react";
import Header from "../Shared/Header";

type ISODate = `${number}-${number}-${number}`;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function generateCalendar(year: number, monthIndex: number): number[] {
  const totalDays = new Date(year, monthIndex + 1, 0).getDate();
  const startDay = new Date(year, monthIndex, 1).getDay();
  const prevMonthDays = new Date(year, monthIndex, 0).getDate();

  const prevDays = Array.from(
    { length: startDay },
    (_, i) => prevMonthDays - startDay + i + 1,
  );

  const currentDays = Array.from({ length: totalDays }, (_, i) => i + 1);

  const totalCells = prevDays.length + currentDays.length;
  const remainder = totalCells % 7;

  const nextDays =
    remainder === 0
      ? []
      : Array.from({ length: 7 - remainder }, (_, i) => i + 1);

  return [...prevDays, ...currentDays, ...nextDays];
}

/** UTC-normalized ISO date */
function toISODate(year: number, monthIndex: number, day: number): ISODate {
  return new Date(Date.UTC(year, monthIndex, day))
    .toISOString()
    .slice(0, 10) as ISODate;
}

function isPastISODate(iso: ISODate): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(iso) < today;
}

export default function AvailabilityCalendar() {
  const today = new Date();

  const [year, setYear] = useState(() => today.getFullYear());
  const [monthIndex, setMonthIndex] = useState(() => today.getMonth());

  const [savedUnavailableDays, setSavedUnavailableDays] = useState<
    Set<ISODate>
  >(() => new Set());

  const [draftUnavailableDays, setDraftUnavailableDays] = useState<
    Set<ISODate>
  >(() => new Set());

  const [canEdit, setCanEdit] = useState(false);

  const days = generateCalendar(year, monthIndex);
  const totalDays = new Date(year, monthIndex + 1, 0).getDate();
  const startIndex = days.indexOf(1);
  const endIndex = startIndex + totalDays - 1;

  function isPastMonth() {
    return (
      year < today.getFullYear() ||
      (year === today.getFullYear() && monthIndex < today.getMonth())
    );
  }

  function toggleDay(day: number, isCurrentMonth: boolean) {
    if (!canEdit || !isCurrentMonth) return;

    const iso = toISODate(year, monthIndex, day);
    if (isPastISODate(iso)) return;

    setDraftUnavailableDays((prev) => {
      const next = new Set(prev);
      next.has(iso) ? next.delete(iso) : next.add(iso);
      return next;
    });
  }

  function startEditing() {
    setDraftUnavailableDays(new Set(savedUnavailableDays));
    setCanEdit(true);
  }

  function saveChanges() {
    setSavedUnavailableDays(new Set(draftUnavailableDays));
    setCanEdit(false);
  }

  function cancelChanges() {
    setDraftUnavailableDays(new Set(savedUnavailableDays));
    setCanEdit(false);
  }

  function prevMonth() {
    if (canEdit || isPastMonth()) return;

    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear((y) => y - 1);
    } else {
      setMonthIndex((m) => m - 1);
    }
  }

  function nextMonth() {
    if (canEdit) return;

    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear((y) => y + 1);
    } else {
      setMonthIndex((m) => m + 1);
    }
  }

  useEffect(() => {
    setCanEdit(false);
    setDraftUnavailableDays(new Set(savedUnavailableDays));
  }, [monthIndex, year]);

  return (
    <div className="flex-1 p-6 bg-[#FAF5ED] rounded-xl space-y-6 text-[#2C1A0E]">
      <Header
        title="Availability"
        description="Select days you are available"
        children={
          <div className="flex items-center gap-3">
            <div className="font-semibold">
              {MONTHS[monthIndex]} {year}
            </div>

            <button
              onClick={prevMonth}
              disabled={isPastMonth()}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              ←
            </button>

            <button onClick={nextMonth} className="px-3 py-1 border rounded">
              →
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-7 text-center text-xs font-medium text-[#6B4A2D]">
        {WEEKDAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-[#E8D8C5] rounded-lg overflow-hidden border border-[rgba(196,99,42,0.12)]">
        {days.map((day, i) => {
          const isCurrentMonth = i >= startIndex && i <= endIndex;

          const iso = toISODate(year, monthIndex, day);
          const isPast = isCurrentMonth && isPastISODate(iso);

          const activeSet = canEdit
            ? draftUnavailableDays
            : savedUnavailableDays;

          const isUnavailable = isCurrentMonth && activeSet.has(iso);

          return (
            <div
              key={i}
              onClick={() => toggleDay(day, isCurrentMonth)}
              className={`
                h-16 flex items-center justify-center text-sm
                ${!isCurrentMonth ? "bg-[#F1E6D8] text-gray-400" : ""}
                ${isPast ? "bg-gray-200 text-gray-400 cursor-not-allowed" : ""}
                ${
                  isCurrentMonth && !isPast && !isUnavailable
                    ? "bg-green-500 text-white cursor-pointer"
                    : ""
                }
                ${isUnavailable ? "bg-red-500 text-white cursor-pointer" : ""}
                ${
                  canEdit && isCurrentMonth && !isPast ? "hover:opacity-80" : ""
                }
              `}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-sm" />
            Available
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-sm" />
            Unavailable
          </div>
        </div>

        {!canEdit ? (
          <button
            onClick={startEditing}
            className="px-4 py-2 rounded-lg bg-[#C4632A] text-white font-semibold"
          >
            Manage Schedule
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={saveChanges}
              className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold"
            >
              Save
            </button>
            <button
              onClick={cancelChanges}
              className="px-4 py-2 rounded-lg bg-gray-500 text-white font-semibold"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
