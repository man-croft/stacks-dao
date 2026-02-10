"use client";

import { useState } from "react";
import { useWallet } from "@/components/wallet-provider";
import { openContractCall } from "@stacks/connect";
import { uintCV, contractPrincipalCV } from "@stacks/transactions";
import { getContractOwner, CONTRACT_NAMES } from "@/lib/constants";
import { getExplorerTxLink } from "@/lib/explorer";
import { toast } from "sonner";
import { Proposal } from "@/lib/stacks-client";

interface ProposalActionsProps {
  proposalId: number;
  proposal: Proposal;
  currentBlockHeight?: number;
}

type ActionType = "queue" | "execute" | "cancel";

/**
 * Action buttons for queue, execute, and cancel based on proposal state
 */
export function ProposalActions({ proposalId, proposal, currentBlockHeight = 0 }: ProposalActionsProps) {
  const { address } = useWallet();
  const [loading, setLoading] = useState<ActionType | null>(null);

  const owner = getContractOwner();
  const isProposer = address === proposal.proposer;
  
  // Determine what actions are available
  const votingEnded = currentBlockHeight > proposal["end-height"];
  const canQueue = votingEnded && !proposal.eta && !proposal.executed && !proposal.cancelled;
  const canExecute = proposal.eta !== null && currentBlockHeight >= proposal.eta && !proposal.executed && !proposal.cancelled;
  const canCancel = isProposer && !proposal.executed && !proposal.cancelled;

  const handleQueue = async () => {
    if (!address || loading) return;
    setLoading("queue");

    try {
      await openContractCall({
        contractAddress: owner,
        contractName: CONTRACT_NAMES.DAO_CORE,
        functionName: "queue",
        functionArgs: [uintCV(proposalId)],
        onFinish: (data) => {
          toast.success("Proposal queued for execution!", {
            action: {
              label: "View",
              onClick: () => window.open(getExplorerTxLink(data.txId), "_blank"),
            },
          });
          setLoading(null);
        },
        onCancel: () => setLoading(null),
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to queue proposal");
      setLoading(null);
    }
  };

  const handleExecute = async () => {
    if (!address || loading) return;
    setLoading("execute");

    try {
      // Extract adapter principal from proposal
      const [adapterAddress, adapterName] = proposal.adapter.split(".");
      
      await openContractCall({
        contractAddress: owner,
        contractName: CONTRACT_NAMES.DAO_CORE,
        functionName: "execute",
        functionArgs: [
          uintCV(proposalId),
          contractPrincipalCV(adapterAddress, adapterName),
          // For STX transfers, we pass dao-core as the token trait (ignored)
          // For FT transfers, this should be the actual token
          proposal.payload.token 
            ? contractPrincipalCV(...proposal.payload.token.split(".") as [string, string])
            : contractPrincipalCV(owner, CONTRACT_NAMES.DAO_CORE),
        ],
        onFinish: (data) => {
          toast.success("Proposal executed successfully!", {
            action: {
              label: "View",
              onClick: () => window.open(getExplorerTxLink(data.txId), "_blank"),
            },
          });
          setLoading(null);
        },
        onCancel: () => setLoading(null),
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to execute proposal");
      setLoading(null);
    }
  };

  const handleCancel = async () => {
    if (!address || loading) return;
    setLoading("cancel");

    try {
      await openContractCall({
        contractAddress: owner,
        contractName: CONTRACT_NAMES.DAO_CORE,
        functionName: "cancel",
        functionArgs: [uintCV(proposalId)],
        onFinish: (data) => {
          toast.success("Proposal cancelled", {
            action: {
              label: "View",
              onClick: () => window.open(getExplorerTxLink(data.txId), "_blank"),
            },
          });
          setLoading(null);
        },
        onCancel: () => setLoading(null),
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to cancel proposal");
      setLoading(null);
    }
  };

  if (!address) {
    return null;
  }

  // If no actions available
  if (!canQueue && !canExecute && !canCancel) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-white/60">Actions</h3>
      <div className="flex flex-wrap gap-2">
        {canQueue && (
          <button
            onClick={handleQueue}
            disabled={loading !== null}
            className="flex-1 min-w-[120px] flex items-center justify-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 py-3 text-amber-400 font-medium hover:bg-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading === "queue" ? (
              <span className="animate-pulse">Queuing...</span>
            ) : (
              "Queue"
            )}
          </button>
        )}
        
        {canExecute && (
          <button
            onClick={handleExecute}
            disabled={loading !== null}
            className="flex-1 min-w-[120px] flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 py-3 text-emerald-400 font-medium hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading === "execute" ? (
              <span className="animate-pulse">Executing...</span>
            ) : (
              "Execute"
            )}
          </button>
        )}
        
        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={loading !== null}
            className="flex-1 min-w-[120px] flex items-center justify-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 py-3 text-rose-400 font-medium hover:bg-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading === "cancel" ? (
              <span className="animate-pulse">Cancelling...</span>
            ) : (
              "Cancel"
            )}
          </button>
        )}
      </div>
      
      {canCancel && !canQueue && !canExecute && (
        <p className="text-xs text-white/40">
          Only the proposer can cancel this proposal
        </p>
      )}
    </div>
  );
}
