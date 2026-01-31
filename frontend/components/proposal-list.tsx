"use client";

import { useState } from "react";
import { useProposal } from "@/hooks/use-proposal";
import { Skeleton } from "@/components/skeleton";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";

export function ProposalList() {
  const [filter, setFilter] = useState<"all" | "active" | "executed">("all");
  // Mock IDs: In a real app, we'd fetch the total count and iterate
  const ids = [1, 2, 3, 4, 5];

  // We filter client side for mock IDs, but we need to know if ALL are hidden
  // Ideally, this logic moves up or we use a better data fetcher
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white/90">Proposals</h2>
        <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
          {(["all", "active", "executed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition ${
                filter === f
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {ids.length === 0 ? (
          <EmptyState actionHref="/proposals/create" actionLabel="Create Proposal" />
        ) : (
          ids.map((id) => (
            <ProposalCard key={id} id={id} filter={filter} />
          ))
        )}
      </div>
    </div>
  );
}

function ProposalCard({ id, filter }: { id: number; filter: string }) {
  const { proposal, loading, error } = useProposal(id); // Assuming hook returns error

  if (loading) return <Skeleton className="h-32" />;
  if (error) return null; // Or show error state
  if (!proposal) return null;

  // Client-side filtering logic
  const isActive = !proposal.executed && !proposal.cancelled;
  const isExecuted = proposal.executed;
  
  if (filter === "active" && !isActive) return null;
  if (filter === "executed" && !isExecuted) return null;

  return (
    <Link href={`/proposals/${id}`} className="block rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/60">Proposal #{id}</span>
        <span className={`rounded-full px-2 py-1 text-xs ${
          proposal.executed ? "bg-emerald-500/10 text-emerald-400" : 
          proposal.cancelled ? "bg-rose-500/10 text-rose-400" :
          "bg-blue-500/10 text-blue-400"
        }`}>
          {proposal.executed ? "Executed" : proposal.cancelled ? "Cancelled" : "Active"}
        </span>
      </div>
      <div className="mt-2 text-lg font-medium text-white/90">
        Execute Transfer
      </div>
      <div className="mt-2 flex gap-4 text-xs text-white/40">
        <span>For: {Number(proposal["for-votes"])}</span>
        <span>Against: {Number(proposal["against-votes"])}</span>
      </div>
    </Link>
  );
}
