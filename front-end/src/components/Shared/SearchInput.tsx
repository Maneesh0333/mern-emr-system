import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

type SearchInputProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchInput({
  value = "",
  onChange,
  placeholder = "Search...",
  className = "",
}: SearchInputProps) {
  const [input, setInput] = useState(value);

  const [debouncedValue] = useDebounce(input, 500);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return (
    <input
      type="text"
      value={input}
      placeholder={placeholder}
      onChange={(e) => setInput(e.target.value)}
      className={`px-4 py-2 rounded-lg border border-[var(--border-1)] bg-white text-sm outline-none ${className}`}
    />
  );
}