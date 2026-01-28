"use client";

import { useProposal } from "@/hooks/use-proposal";

// Mock list of IDs for MVP since we don't have an indexer yet
const RECENT_PROPOSALS = [1, 2, 3];

export function ProposalList() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white/90">Recent Proposals</h2>
      <div className="grid gap-4">
        {RECENT_PROPOSALS.map((id) => (
          <ProposalCard key={id} id={id} />
        ))}
      </div>
    </div>
  );
}

function ProposalCard({ id }: { id: number }) {
  const { proposal, loading } = useProposal(id);

  if (loading) return <div className="h-24 animate-pulse rounded-xl bg-white/5" />;
  
  // Placeholder state for now
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/60">Proposal #{id}</span>
        <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/60">
          Pending
        </span>
      </div>
      <div className="mt-2 text-lg font-medium">
        Execute Transfer
      </div>
    </div>
  );
}
