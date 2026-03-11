type Chip = {
  label: string;
  value: string;
};

type FilterChipsProps = {
  chips: Chip[];
  active: string;
  onChange: (value: string) => void;
  activeClassName?: string;
  inactiveClassName?: string;
};

export default function FilterChips({
  chips,
  active,
  onChange,
  activeClassName = "bg-[#C4632A] text-white",
  inactiveClassName = "border-[rgba(196,99,42,0.12)] text-[#2C1A0E]",
}: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => {
        const isActive = active === chip.value;

        return (
          <button
            key={chip.value}
            onClick={() => onChange(chip.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer
            ${isActive ? activeClassName : inactiveClassName}`}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}