import { useEffect, useState } from "react";
import Header from "../Shared/Header";
import FilterChips from "../Shared/FilterChips";
import SearchInput from "../Shared/SearchInput";
import Table from "../Shared/Table";
import { getChips } from "../../utils/Filterschips";
import AppointmentsRow from "./AppointmentsRow";
import { useAppointments } from "../../hooks/Admin/useAppointments";
import { useAuthStore } from "../../stores/authStore";
import Pagination from "../Shared/Pagination";

export default function Appointments() {
  const user = useAuthStore((state) => state.user);

  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAppointments(
    activeFilter,
    search,
    date,
    page,
  );

  const appointments = data?.appointments ?? [];

  const chips = getChips(
    data?.stats ?? {
      scheduled: 0,
      completed: 0,
      cancelled: 0,
    },
    data?.total ?? 0,
  );

  useEffect(() => {
    setPage(1);
  }, [activeFilter, search]);

  if (isError) return <p>Error loading appointments</p>;

  return (
    <div className="flex-1 p-6 space-y-6 bg-[#FAF5ED] text-[#2C1A0E] overflow-y-auto">
      <Header
        title="Appointments"
        description={`${data?.total ?? 0} total appointments`}
        children={
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 rounded-xl
  border border-[rgba(196,99,42,0.2)]
  focus:outline-none focus:border-[var(--clay)]
  bg-white"
          />
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <FilterChips
          chips={chips}
          active={activeFilter}
          onChange={setActiveFilter}
        />

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search patient..."
          className="w-70 max-lg:w-full"
        />
      </div>

      <Table
        headers={
          user?.role === "DOCTOR"
            ? ["Patient", "Phone", "Date", "Time", "Status", "Actions"]
            : [
                "Patient",
                "Phone",
                "Doctor",
                "Department",
                "Date",
                "Time",
                "Status",
                "Actions",
              ]
        }
        data={appointments}
        isLoading={isLoading}
        emptyMessage="No Appointments "
        colSpan={8}
        renderRow={(item) => <AppointmentsRow key={item._id} item={item} />}
      />

      <Pagination
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}
