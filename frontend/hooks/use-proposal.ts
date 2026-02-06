import { useCallback, useEffect, useState } from "react";
import { getProposal, Proposal } from "@/lib/stacks-client";
import { getContractOwner, CONTRACT_NAMES } from "@/lib/constants";

// Re-export types for convenience
export type { Proposal } from "@/lib/stacks-client";

// Legacy type alias for backward compatibility
export type ProposalData = Proposal;

/**
 * React hook to fetch and manage proposal data
 * @param id - The proposal ID to fetch
 * @returns Object with proposal data, loading state, error, and refetch function
 */
export function useProposal(id: number) {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProposal = useCallback(async () => {
    // Validate ID
    if (id < 1) {
      setProposal(null);
      setError("Invalid proposal ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getProposal(id);
      
      if (result) {
        setProposal(result);
      } else {
        setProposal(null);
        // Not an error - proposal may not exist yet
      }
    } catch (e) {
      console.error(`Error fetching proposal ${id}:`, e);
      setError("Failed to fetch proposal details.");
      setProposal(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProposal();
  }, [fetchProposal]);

  return { proposal, loading, error, refetch: fetchProposal };
}

/**
 * Computed properties for proposal state
 */
export function getProposalStatus(proposal: Proposal | null): string {
  if (!proposal) return "unknown";
  if (proposal.executed) return "executed";
  if (proposal.cancelled) return "cancelled";
  if (proposal.eta) return "queued";
  return "active";
}

/**
 * Check if voting is still open for a proposal
 * Note: This requires knowing the current block height
 */
export function isVotingOpen(
  proposal: Proposal | null,
  currentBlockHeight: number
): boolean {
  if (!proposal) return false;
  if (proposal.executed || proposal.cancelled) return false;
  return (
    currentBlockHeight >= proposal["start-height"] &&
    currentBlockHeight <= proposal["end-height"]
  );
}
