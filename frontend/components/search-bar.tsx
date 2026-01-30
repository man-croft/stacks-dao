"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    // Assuming search by ID for now
    router.push(`/proposals/${query}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="number"
        placeholder="Search Proposal ID..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-10 text-sm text-white placeholder-white/30 focus:border-white/20 focus:outline-none focus:ring-0 transition"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
        🔍
      </span>
    </form>
  );
}
