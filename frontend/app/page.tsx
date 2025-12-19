"use client";

import { useState, useEffect } from "react";
import { ConnectButton } from "@/components/connect-button";
import { WalletProvider } from "@/components/wallet-provider";
import { DAOStatsPanel } from "@/components/dao-stats";
import { ProposalCard } from "@/components/proposal-card";
import { CreateProposalModal } from "@/components/create-proposal-modal";
import { getAllProposals, type Proposal } from "@/lib/daoClient";

function HomePage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "voting" | "queued">("all");

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    setLoading(true);
    const data = await getAllProposals();
    setProposals(data);
    setLoading(false);
  };

  const filteredProposals = proposals.filter((p) => {
    if (filter === "all") return true;
    if (filter === "voting") return p.status === "Voting";
    if (filter === "queued") return p.status === "Queued" || p.status === "Ready";
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-xl">🏛️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Stacks DAO</h1>
                <p className="text-xs text-white/50">Token-governed treasury</p>
              </div>
            </div>
            <ConnectButton />
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats */}
          <DAOStatsPanel />

          {/* Actions Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "all"
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                All Proposals
              </button>
              <button
                onClick={() => setFilter("voting")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "voting"
                    ? "bg-green-600/30 text-green-300 border border-green-500/50"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                Active Voting
              </button>
              <button
                onClick={() => setFilter("queued")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "queued"
                    ? "bg-blue-600/30 text-blue-300 border border-blue-500/50"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                Queued
              </button>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg hover:shadow-xl"
            >
              + Create Proposal
            </button>
          </div>

          {/* Proposals List */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredProposals.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProposals.map((proposal, index) => (
                <ProposalCard key={proposal.id} proposal={proposal} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-xl text-white/60">No proposals found</p>
              <p className="text-sm text-white/40 mt-2">
                Be the first to create a proposal!
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Create Proposal Modal */}
      <CreateProposalModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        onSuccess={loadProposals}
      />
    </div>
  );
}

export default function Home() {
  return (
    <WalletProvider>
      <HomePage />
    </WalletProvider>
  );
}
