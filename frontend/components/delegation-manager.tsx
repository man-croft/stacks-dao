"use client";

import { useState } from "react";
import { useWallet } from "@/components/wallet-provider";
import { openContractCall } from "@stacks/connect";
import { principalCV } from "@stacks/transactions";
import { getContractOwner, CONTRACT_NAMES } from "@/lib/constants";
import { getExplorerTxLink } from "@/lib/explorer";
import { toast } from "sonner";

/**
 * Component for managing vote delegation
 */
export function DelegationManager() {
  const { address } = useWallet();
  const [delegateAddress, setDelegateAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<"delegate" | "revoke" | null>(null);

  const owner = getContractOwner();

  const handleDelegate = async () => {
    if (!address || !delegateAddress || loading) return;
    
    // Basic validation
    if (!delegateAddress.startsWith("ST") && !delegateAddress.startsWith("SP")) {
      toast.error("Invalid Stacks address");
      return;
    }
    
    if (delegateAddress === address) {
      toast.error("Cannot delegate to yourself");
      return;
    }

    setLoading(true);
    setAction("delegate");

    try {
      await openContractCall({
        contractAddress: owner,
        contractName: CONTRACT_NAMES.DAO_CORE,
        functionName: "delegate-vote",
        functionArgs: [principalCV(delegateAddress)],
        onFinish: (data) => {
          toast.success("Delegation successful!", {
            description: `Your voting power is now delegated to ${delegateAddress.slice(0, 8)}...`,
            action: {
              label: "View",
              onClick: () => window.open(getExplorerTxLink(data.txId), "_blank"),
            },
          });
          setDelegateAddress("");
          setLoading(false);
          setAction(null);
        },
        onCancel: () => {
          setLoading(false);
          setAction(null);
        },
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to delegate vote");
      setLoading(false);
      setAction(null);
    }
  };

  const handleRevoke = async () => {
    if (!address || loading) return;

    setLoading(true);
    setAction("revoke");

    try {
      await openContractCall({
        contractAddress: owner,
        contractName: CONTRACT_NAMES.DAO_CORE,
        functionName: "revoke-delegation",
        functionArgs: [],
        onFinish: (data) => {
          toast.success("Delegation revoked", {
            description: "Your voting power is now under your control",
            action: {
              label: "View",
              onClick: () => window.open(getExplorerTxLink(data.txId), "_blank"),
            },
          });
          setLoading(false);
          setAction(null);
        },
        onCancel: () => {
          setLoading(false);
          setAction(null);
        },
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to revoke delegation");
      setLoading(false);
      setAction(null);
    }
  };

  if (!address) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-medium text-white/90 mb-2">Vote Delegation</h3>
        <p className="text-sm text-white/50">
          Connect your wallet to manage vote delegation
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
      <div>
        <h3 className="text-lg font-medium text-white/90">Vote Delegation</h3>
        <p className="text-sm text-white/50 mt-1">
          Delegate your voting power to another address or revoke an existing delegation
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="delegate" className="block text-sm font-medium text-white/70 mb-1.5">
            Delegate Address
          </label>
          <input
            id="delegate"
            type="text"
            value={delegateAddress}
            onChange={(e) => setDelegateAddress(e.target.value)}
            placeholder="ST... or SP..."
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            disabled={loading}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDelegate}
            disabled={loading || !delegateAddress}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-500/10 border border-blue-500/20 py-3 text-blue-400 font-medium hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading && action === "delegate" ? (
              <span className="animate-pulse">Delegating...</span>
            ) : (
              "Delegate"
            )}
          </button>

          <button
            onClick={handleRevoke}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-3 text-white/70 font-medium hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading && action === "revoke" ? (
              <span className="animate-pulse">Revoking...</span>
            ) : (
              "Revoke Delegation"
            )}
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-white/5">
        <p className="text-xs text-white/40">
          When you delegate, your voting power is added to the delegate&apos;s votes. 
          You can only have one active delegation at a time.
        </p>
      </div>
    </div>
  );
}
