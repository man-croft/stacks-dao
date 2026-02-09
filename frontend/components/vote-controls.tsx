"use client";

import { useState } from "react";
import { useWallet } from "@/components/wallet-provider";
import { openContractCall } from "@stacks/connect";
import { uintCV } from "@stacks/transactions";
import { getContractOwner, VOTE_CHOICES } from "@/lib/constants";
import { getExplorerTxLink } from "@/lib/explorer";
import { toast } from "sonner";

interface VoteControlsProps {
  proposalId: number;
  disabled?: boolean;
}

export function VoteControls({ proposalId, disabled = false }: VoteControlsProps) {
  const { address } = useWallet();
  const [loading, setLoading] = useState(false);
  const [votingChoice, setVotingChoice] = useState<number | null>(null);

  const castVote = async (choice: number) => {
    if (!address || loading) return;
    setLoading(true);
    setVotingChoice(choice);
    
    const owner = getContractOwner();
    
    try {
      await openContractCall({
        contractAddress: owner,
        contractName: "dao-core-v1",
        functionName: "cast-vote",
        functionArgs: [uintCV(proposalId), uintCV(choice)],
        onFinish: (data) => {
          const choiceLabel = choice === VOTE_CHOICES.FOR ? "For" : 
                              choice === VOTE_CHOICES.AGAINST ? "Against" : "Abstain";
          toast.success(`Vote "${choiceLabel}" broadcasted!`, {
            action: {
              label: "View on Explorer",
              onClick: () => window.open(getExplorerTxLink(data.txId), "_blank"),
            },
          });
          setLoading(false);
          setVotingChoice(null);
        },
        onCancel: () => {
          setLoading(false);
          setVotingChoice(null);
        },
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to broadcast vote");
      setLoading(false);
      setVotingChoice(null);
    }
  };

  if (!address) {
    return (
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-sm text-white/60">
        Connect wallet to vote
      </div>
    );
  }

  const isDisabled = loading || disabled;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => castVote(VOTE_CHOICES.FOR)}
          disabled={isDisabled}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 py-4 text-emerald-400 font-medium hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading && votingChoice === VOTE_CHOICES.FOR ? (
            <span className="animate-pulse">Voting...</span>
          ) : (
            "Vote For"
          )}
        </button>
        <button
          onClick={() => castVote(VOTE_CHOICES.AGAINST)}
          disabled={isDisabled}
          className="flex items-center justify-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 py-4 text-rose-400 font-medium hover:bg-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading && votingChoice === VOTE_CHOICES.AGAINST ? (
            <span className="animate-pulse">Voting...</span>
          ) : (
            "Vote Against"
          )}
        </button>
      </div>
      <button
        onClick={() => castVote(VOTE_CHOICES.ABSTAIN)}
        disabled={isDisabled}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-3 text-white/60 font-medium hover:bg-white/10 hover:text-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading && votingChoice === VOTE_CHOICES.ABSTAIN ? (
          <span className="animate-pulse">Voting...</span>
        ) : (
          "Abstain"
        )}
      </button>
    </div>
  );
}
