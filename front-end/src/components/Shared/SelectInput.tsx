import { useState, useEffect } from "react";

type Option = { label: string; value: string };

type SelectInputProps = {
  label: string;
  options: Option[];
  value?: string; // controlled value
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
};

function SelectInput({
  label,
  options,
  value = "",       // controlled value
  onChange,
  error,
  placeholder = "Select an option",
}: SelectInputProps) {
  const [open, setOpen] = useState(false);

  // Displayed selected option is always derived from value
  const selected = options.find((o) => o.value === value) ?? null;

  const handleSelect = (option: Option) => {
    onChange(option.value); // update parent form
    setOpen(false);
  };

  return (
    <div className="relative">
      <label className="text-xs font-semibold tracking-wide text-[var(--clay)]">
        {label}
      </label>

      <div
        onClick={() => setOpen(!open)}
        className="mt-2 w-full px-3 py-2 text-sm rounded-xl border border-[var(--border-1)] cursor-pointer bg-white flex justify-between"
      >
        <span>{selected?.label ?? placeholder}</span>
        <span>▼</span>
      </div>

      {open && (
        <ul className="absolute w-full bg-white border border-[var(--border-1)] rounded-xl mt-1 shadow-lg z-50">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default SelectInput;