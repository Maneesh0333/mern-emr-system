import { useState } from "react";
import Header from "../Shared/Header";
import FilterChips from "../Shared/FilterChips";
import SearchInput from "../Shared/SearchInput";
import Table from "../Shared/Table";
import SideSheet from "../Shared/SideSheet";
import Button from "../Shared/Button";

import {
  useDoctors,
  useDisableDoctor,
  useEnableDoctor,
  type Doctor,
} from "../../hooks/Admin/useDoctors";

import DoctorsRow from "./DoctorsRow";
import DoctorForm from "../forms/DoctorForm";
import { getChips } from "../../utils/Filterschips";

export default function Doctors() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const { data, isLoading, isError } = useDoctors(activeFilter, search);

  const enableMutation = useEnableDoctor();
  const disableMutation = useDisableDoctor();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading doctors</p>;

  const doctors = data?.doctors ?? [];

  const chips = getChips(data?.stats, data?.totalDoctors);

  return (
    <div className="flex-1 p-6 space-y-6 bg-[#FAF5ED] text-[#2C1A0E] overflow-y-auto">
      <Header
        title="Doctors"
        description={`${data?.totalDoctors} registered doctors`}
        children={
          <Button
            label="+ Add Doctor"
            onClick={() => {
              setSelectedDoctor(null);
              setOpen(true);
            }}
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
          placeholder="Search doctor..."
          className="w-70 max-lg:w-full"
        />
      </div>

      <Table
        headers={[
          "Name",
          "Email",
          "Department",
          "Specialty",
          "Status",
          "Created",
          "Actions",
        ]}
        data={doctors}
        colSpan={7}
        renderRow={(item) => (
          <DoctorsRow
            key={item._id}
            item={item}
            disableMutation={disableMutation}
            enableMutation={enableMutation}
            onEdit={(doc) => {
              setSelectedDoctor(doc);
              setOpen(true);
            }}
          />
        )}
      />

      <SideSheet
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedDoctor(null);
        }}
        title={selectedDoctor ? "Edit Doctor" : "Add Doctor"}
        discription={
          selectedDoctor
            ? "Update doctor details"
            : "Fill details to create a doctor"
        }
      >
        <DoctorForm doctor={selectedDoctor} closeSheet={() => setOpen(false)} />
      </SideSheet>
    </div>
  );
}
