"use client";

import { useState, useEffect } from "react";
import { useProposal, getProposalStatus, Proposal } from "@/hooks/use-proposal";
import { getTotalProposals } from "@/lib/stacks-client";
import { Skeleton } from "@/components/skeleton";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";

type FilterType = "all" | "active" | "executed" | "cancelled" | "queued";

/**
 * Hook to fetch total proposal count from contract
 */
function useProposalIds() {
  const [ids, setIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIds() {
      setLoading(true);
      setError(null);
      try {
        const total = await getTotalProposals();
        // Create array of IDs from 1 to total (newest first)
        const proposalIds = Array.from({ length: total }, (_, i) => total - i);
        setIds(proposalIds);
      } catch (e) {
        console.error("Failed to fetch proposal count:", e);
        setError("Failed to load proposals");
        setIds([]);
      } finally {
        setLoading(false);
      }
    }

    fetchIds();
  }, []);

  return { ids, loading, error };
}

export function ProposalList() {
  const [filter, setFilter] = useState<FilterType>("all");
  const { ids, loading: idsLoading, error: idsError } = useProposalIds();

  const filterOptions: FilterType[] = ["all", "active", "queued", "executed", "cancelled"];

  if (idsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white/90">Proposals</h2>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (idsError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white/90">Proposals</h2>
        </div>
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-6 text-center">
          <p className="text-rose-400">{idsError}</p>
          <p className="mt-2 text-sm text-white/50">
            Make sure you&apos;re connected to the correct network
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white/90">
          Proposals
          {ids.length > 0 && (
            <span className="ml-2 text-sm font-normal text-white/40">
              ({ids.length})
            </span>
          )}
        </h2>
        <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
          {filterOptions.map((f) => (
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
          <EmptyState
            actionHref="/proposals/create"
            actionLabel="Create First Proposal"
          />
        ) : (
          ids.map((id) => (
            <ProposalCard key={id} id={id} filter={filter} />
          ))
        )}
      </div>
    </div>
  );
}

function ProposalCard({ id, filter }: { id: number; filter: FilterType }) {
  const { proposal, loading, error } = useProposal(id);

  if (loading) return <Skeleton className="h-32" />;
  if (error || !proposal) return null;

  const status = getProposalStatus(proposal);

  // Client-side filtering
  if (filter !== "all" && status !== filter) return null;

  // Status badge styling
  const statusStyles: Record<string, string> = {
    executed: "bg-emerald-500/10 text-emerald-400",
    cancelled: "bg-rose-500/10 text-rose-400",
    queued: "bg-amber-500/10 text-amber-400",
    active: "bg-blue-500/10 text-blue-400",
  };

  // Generate proposal title from payload
  const getProposalTitle = (p: Proposal): string => {
    const kind = p.payload.kind;
    if (kind === "stx-transfer") {
      return `Transfer ${(p.payload.amount / 1000000).toFixed(2)} STX`;
    }
    if (kind === "ft-transfer") {
      return `Transfer ${p.payload.amount} Tokens`;
    }
    return kind.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <Link
      href={`/proposals/${id}`}
      className="block rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/60">
          Proposal #{id}
        </span>
        <span
          className={`rounded-full px-2 py-1 text-xs capitalize ${
            statusStyles[status] || statusStyles.active
          }`}
        >
          {status}
        </span>
      </div>
      
      <div className="mt-2 text-lg font-medium text-white/90">
        {getProposalTitle(proposal)}
      </div>
      
      <div className="mt-3 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="text-emerald-400">{proposal["for-votes"]}</span>
            <span className="text-white/30">/</span>
            <span className="text-rose-400">{proposal["against-votes"]}</span>
            <span className="text-white/30">/</span>
            <span className="text-white/40">{proposal["abstain-votes"]}</span>
          </div>
          <span className="text-xs text-white/30">votes</span>
        </div>
        
        {proposal.eta && (
          <div className="text-xs text-white/40">
            Executes at block {proposal.eta}
          </div>
        )}
      </div>
    </Link>
  );
}
