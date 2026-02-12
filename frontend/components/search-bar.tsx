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
        className="w-full rounded-lg sm:rounded-xl border border-white/10 bg-white/5 px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-10 text-sm text-white placeholder-white/30 focus:border-white/20 focus:outline-none focus:ring-0 transition min-h-[44px]"
      />
      <span className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm sm:text-base">
        🔍
      </span>
    </form>
  );
}
