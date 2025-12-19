"use client";

import { type Proposal } from "@/lib/daoClient";
import { useWallet } from "./wallet-provider";
import { openContractCall } from "@stacks/connect";
import { uintCV, stringAsciiCV } from "@stacks/transactions";
import { StacksMainnet } from "@stacks/network";

const STATUS_COLORS = {
  Voting: "bg-green-500/20 border-green-500/50 text-green-300",
  Queued: "bg-blue-500/20 border-blue-500/50 text-blue-300",
  Ready: "bg-yellow-500/20 border-yellow-500/50 text-yellow-300",
  Executed: "bg-gray-500/20 border-gray-500/50 text-gray-300",
  Cancelled: "bg-red-500/20 border-red-500/50 text-red-300",
  Failed: "bg-red-500/20 border-red-500/50 text-red-300",
};

interface ProposalCardProps {
  proposal: Proposal;
  index: number;
}

export function ProposalCard({ proposal, index }: ProposalCardProps) {
  const { address } = useWallet();
  const canVote = address && proposal.status === "Voting";

  const totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
  const forPercent = totalVotes > 0 ? (proposal.forVotes / totalVotes) * 100 : 0;
  const againstPercent = totalVotes > 0 ? (proposal.againstVotes / totalVotes) * 100 : 0;

  const handleVote = async (choice: number) => {
    if (!address) return;

    try {
      await openContractCall({
        network: new StacksMainnet(),
        contractAddress: "SP000000000000000000002Q6VF78", // Update with deployed address
        contractName: "dao-core",
        functionName: "cast-vote",
        functionArgs: [uintCV(proposal.id), uintCV(choice)],
        onFinish: (data) => {
          console.log("Vote submitted:", data);
          // Refresh proposals after voting
          window.location.reload();
        },
        onCancel: () => {
          console.log("Vote cancelled");
        },
      });
    } catch (error) {
      console.error("Vote error:", error);
    }
  };

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-6 transition-all hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/10"
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`,
      }}
    >
      {/* Glowing effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-cyan-500/0 opacity-0 group-hover:opacity-10 transition-opacity" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">{proposal.title}</h3>
            <p className="text-sm text-white/60 line-clamp-2">{proposal.description}</p>
          </div>
          <span
            className={`ml-4 px-3 py-1 rounded-full text-xs font-bold border ${
              STATUS_COLORS[proposal.status]
            }`}
          >
            {proposal.status}
          </span>
        </div>

        {/* Amount & Recipient */}
        <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Amount:</span>
            <span className="font-mono font-bold text-white">
              {(proposal.amount / 1_000_000).toFixed(2)} STX
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-white/60">Recipient:</span>
            <span className="font-mono text-xs text-white/80">
              {proposal.recipient.slice(0, 8)}...{proposal.recipient.slice(-6)}
            </span>
          </div>
        </div>

        {/* Vote Progress Bars */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-white/60 mb-1">
            <span>For: {proposal.forVotes}</span>
            <span>Against: {proposal.againstVotes}</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-400 transition-all"
              style={{ width: `${forPercent}%` }}
            />
            <div
              className="bg-gradient-to-r from-red-500 to-rose-400 transition-all"
              style={{ width: `${againstPercent}%` }}
            />
          </div>
        </div>

        {/* Time Remaining */}
        {proposal.status === "Voting" && proposal.hoursRemaining !== undefined && (
          <div className="mb-4 text-sm text-white/60">
            ⏱️ Ends in <span className="font-bold text-white">{proposal.hoursRemaining}h</span> (
            {proposal.blocksRemaining} blocks)
          </div>
        )}

        {/* Vote Buttons */}
        {canVote && (
          <div className="flex gap-2">
            <button
              onClick={() => handleVote(1)}
              className="flex-1 py-2 rounded-lg bg-green-600/20 border border-green-500/50 text-green-300 font-bold hover:bg-green-600/30 transition-all"
            >
              Vote For
            </button>
            <button
              onClick={() => handleVote(0)}
              className="flex-1 py-2 rounded-lg bg-red-600/20 border border-red-500/50 text-red-300 font-bold hover:bg-red-600/30 transition-all"
            >
              Vote Against
            </button>
            <button
              onClick={() => handleVote(2)}
              className="px-4 py-2 rounded-lg bg-gray-600/20 border border-gray-500/50 text-gray-300 font-bold hover:bg-gray-600/30 transition-all"
            >
              Abstain
            </button>
          </div>
        )}

        {!address && proposal.status === "Voting" && (
          <div className="text-center py-2 text-sm text-white/40">
            Connect wallet to vote
          </div>
        )}
      </div>
    </div>
  );
}
