import { useState } from "react";
import Header from "../Shared/Header";
import FilterChips from "../Shared/FilterChips";
import SearchInput from "../Shared/SearchInput";
import Table from "../Shared/Table";
import SideSheet from "../Shared/SideSheet";
import Button from "../Shared/Button";
import { getChips } from "../../utils/Filterschips";
import ReceptionistsRow from "./ReceptionistsRow";
import {
  useDisableReceptionist,
  useEnableReceptionist,
  useReceptionists,
  type Receptionist,
} from "../../hooks/Admin/useReceptionists";
import ReceptionistForm from "../forms/ReceptionistForm";

export default function Receptionists() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Receptionist | null>(
    null,
  );

  const { data, isLoading, isError } = useReceptionists(activeFilter, search);

  const enableMutation = useEnableReceptionist();
  const disableMutation = useDisableReceptionist();

  const doctors = data?.receptionists ?? [];

  const chips = getChips(data?.stats, data?.totalReceptionists);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading doctors</p>;
  return (
    <div className="flex-1 p-6 space-y-6 bg-[#FAF5ED] text-[#2C1A0E] overflow-y-auto">
      <Header
        title="Receptionists"
        description={`${data?.totalReceptionists} registered Receptionists`}
        children={
          <Button
            label="+ Add Receptionists"
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
          placeholder="Search Receptionists..."
          className="w-70 max-lg:w-full"
        />
      </div>

      <Table
        headers={[
          "Name",
          "Email",
          "Department",
          "Status",
          "Created",
          "Actions",
        ]}
        data={doctors}
        colSpan={7}
        renderRow={(item) => (
          <ReceptionistsRow
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
        title={selectedDoctor ? "Edit Receptionists" : "Add Receptionists"}
        discription={
          selectedDoctor
            ? "Update Receptionists details"
            : "Fill details to create a Receptionists"
        }
      >
        <ReceptionistForm
          receptionist={selectedDoctor}
          closeSheet={() => setOpen(false)}
        />
      </SideSheet>
    </div>
  );
}
