"use client";

import { useState } from "react";
import { useWallet } from "@/components/wallet-provider";
import { openContractCall } from "@stacks/connect";
import { uintCV } from "@stacks/transactions";
import { getContractOwner, STACKS_NETWORK_ENV } from "@/lib/constants";
import { getExplorerTxLink } from "@/lib/explorer";
import { toast } from "sonner";

export function VoteControls({ proposalId }: { proposalId: number }) {
  const { address } = useWallet();
  const [loading, setLoading] = useState(false);

  const castVote = async (choice: number) => {
    if (!address) return;
    setLoading(true);
    
    const owner = getContractOwner();
    
    try {
      await openContractCall({
        contractAddress: owner,
        contractName: "dao-core-v1",
        functionName: "cast-vote",
        functionArgs: [uintCV(proposalId), uintCV(choice)],
        onFinish: (data) => {
          toast.success("Vote broadcasted!", {
            action: {
              label: "View on Explorer",
              onClick: () => window.open(getExplorerTxLink(data.txId), "_blank"),
            },
          });
          setLoading(false);
        },
        onCancel: () => {
          setLoading(false);
        },
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to broadcast vote");
      setLoading(false);
    }
  };

  if (!address) {
    return (
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-sm text-white/60">
        Connect wallet to vote
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => castVote(1)}
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 py-4 text-emerald-400 font-medium hover:bg-emerald-500/20 disabled:opacity-50 transition"
      >
        Vote For
      </button>
      <button
        onClick={() => castVote(0)}
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 py-4 text-rose-400 font-medium hover:bg-rose-500/20 disabled:opacity-50 transition"
      >
        Vote Against
      </button>
    </div>
  );
}
