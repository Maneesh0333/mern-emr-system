import { useState } from "react";
import Header from "../Shared/Header";
import FilterChips from "../Shared/FilterChips";
import SearchInput from "../Shared/SearchInput";
import Table from "../Shared/Table";
import { getChips } from "../../utils/Filterschips";
import AppointmentsRow from "./AppointmentsRow";
import { useAppointments } from "../../hooks/Admin/useAppointments";

export default function Appointments() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useAppointments(activeFilter, search);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading appointments</p>;

  const appointments = data?.appointments ?? [];

  const chips = getChips(data?.stats, data?.totalAppointments);

  return (
    <div className="flex-1 p-6 space-y-6 bg-[#FAF5ED] text-[#2C1A0E] overflow-y-auto">
      <Header
        title="Appointments"
        description={`${data?.totalAppointments} total appointments`}
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
        headers={[
          "Patient",
          "Phone",
          "Doctor",
          "Department",
          "Date",
          "Time",
          "Status",
          "Actions",
        ]}
        data={appointments}
        colSpan={8}
        renderRow={(item) => <AppointmentsRow key={item._id} item={item} />}
      />
    </div>
  );
}
