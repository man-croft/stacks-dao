"use client";

import { use, useEffect, useState } from "react";
import { ProposalStats } from "@/components/proposal-stats";
import { VoteControls } from "@/components/vote-controls";
import { useProposal } from "@/hooks/use-proposal";
import Link from "next/link";

export default function ProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = Number(resolvedParams.id);
  const { proposal, loading } = useProposal(id);

  if (loading) {
    return (
      <main className="min-h-screen px-4 sm:px-6 py-6 sm:py-12 flex items-center justify-center text-white/50">
        Loading proposal...
      </main>
    );
  }

  if (!proposal) {
    return (
      <main className="min-h-screen px-4 sm:px-6 py-6 sm:py-12 flex flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-bold text-white/90">Proposal not found</h1>
        <Link href="/" className="text-emerald-400 hover:underline">Return Home</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 sm:px-6 py-6 sm:py-12 flex justify-center">
      <div className="w-full max-w-2xl space-y-6 sm:space-y-8">
        <Link href="/" className="text-sm text-white/50 hover:text-white transition inline-flex items-center gap-1">
          <span>←</span> <span className="hidden sm:inline">Back to Dashboard</span>
          <span className="sm:hidden">Back</span>
        </Link>
        
        <header>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs uppercase tracking-wider text-emerald-400 border border-emerald-400/20 px-2 py-1 rounded-full">
              Proposal #{id}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white/90">
             Execute Transfer
          </h1>
          <p className="text-white/60 mt-2 text-sm sm:text-base">
            Proposer: <span className="font-mono text-xs bg-white/10 px-1 py-0.5 rounded">{proposal.proposer}</span>
          </p>
        </header>

        <section>
          <ProposalStats proposal={proposal} />
        </section>

        <section>
          <h3 className="text-sm font-medium text-white/70 mb-4">Cast your vote</h3>
          <VoteControls proposalId={id} />
        </section>
      </div>
    </main>
  );
}
