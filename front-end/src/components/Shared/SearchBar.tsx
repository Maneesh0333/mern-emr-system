import React, { useState } from "react";

type SearchBarProps = {
  triggerSearch: (query: string) => void;
};

function SearchBar({ triggerSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return; // prevent empty search
    triggerSearch(query.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 flex bg-white rounded-xl overflow-hidden shadow-xl"
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by skill or name…"
        className="flex-1 px-5 py-4 text-sm outline-none"
      />
      <button
        type="submit"
        className="px-8 font-semibold text-white bg-[var(--clay)] hover:bg-[var(--clay-dark)] transition"
      >
        Search →
      </button>
    </form>
  );
}

export default SearchBar;