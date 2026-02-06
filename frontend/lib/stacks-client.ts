import {
  callReadOnlyFunction,
  cvToValue,
  uintCV,
  stringAsciiCV,
  ClarityValue,
} from "@stacks/transactions";
import { StacksMocknet, StacksTestnet, StacksMainnet, StacksNetwork } from "@stacks/network";
import { getApiUrl, getContractOwner, STACKS_NETWORK_ENV } from "./constants";

const DEPLOYER = getContractOwner();
const DAO_CORE_NAME = "dao-core-v1";

// ============================================================================
// Types
// ============================================================================

export interface GovernanceParameters {
  "quorum-percent": number;
  "proposal-threshold-percent": number;
  "voting-period": number;
  timelock: number;
}

export interface ProposalPayload {
  kind: string;
  amount: number;
  recipient: string;
  token: string | null;
  memo: string | null;
}

export interface Proposal {
  proposer: string;
  adapter: string;
  payload: ProposalPayload;
  "start-height": number;
  "end-height": number;
  eta: number | null;
  "for-votes": number;
  "against-votes": number;
  "abstain-votes": number;
  executed: boolean;
  cancelled: boolean;
  "snapshot-supply": number;
  "adapter-hash": string;
}

// ============================================================================
// Network Helpers
// ============================================================================

/**
 * Get the appropriate Stacks network based on environment
 */
export function getNetwork(): StacksNetwork {
  const apiUrl = getApiUrl();
  
  switch (STACKS_NETWORK_ENV) {
    case "mainnet":
      return new StacksMainnet({ url: apiUrl });
    case "testnet":
      return new StacksTestnet({ url: apiUrl });
    default:
      return new StacksMocknet({ url: apiUrl });
  }
}

// ============================================================================
// Read-Only Contract Calls
// ============================================================================

/**
 * Fetch governance parameters from dao-core
 */
export async function getParameters(): Promise<GovernanceParameters | null> {
  try {
    const network = getNetwork();
    
    const result = await callReadOnlyFunction({
      contractAddress: DEPLOYER,
      contractName: DAO_CORE_NAME,
      functionName: "get-parameters",
      functionArgs: [],
      senderAddress: DEPLOYER,
      network,
    });

    if (result) {
      const value = cvToValue(result);
      if (value && value.value) {
        const params = value.value;
        return {
          "quorum-percent": Number(params["quorum-percent"].value),
          "proposal-threshold-percent": Number(params["proposal-threshold-percent"].value),
          "voting-period": Number(params["voting-period"].value),
          timelock: Number(params["timelock"].value),
        };
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch governance parameters:", error);
    return null;
  }
}

/**
 * Fetch a specific governance parameter
 */
export async function getParameter(
  parameter: "quorum-percent" | "proposal-threshold-percent" | "voting-period" | "timelock"
): Promise<number | null> {
  const params = await getParameters();
  return params ? params[parameter] : null;
}

/**
 * Fetch a proposal by ID from dao-core
 */
export async function getProposal(proposalId: number): Promise<Proposal | null> {
  try {
    const network = getNetwork();
    
    const result = await callReadOnlyFunction({
      contractAddress: DEPLOYER,
      contractName: DAO_CORE_NAME,
      functionName: "get-proposal",
      functionArgs: [uintCV(proposalId)],
      senderAddress: DEPLOYER,
      network,
    });

    if (result) {
      const value = cvToValue(result);
      if (value && value.value) {
        const p = value.value;
        return {
          proposer: p.proposer.value,
          adapter: p.adapter.value,
          payload: {
            kind: p.payload.value.kind.value,
            amount: Number(p.payload.value.amount.value),
            recipient: p.payload.value.recipient.value,
            token: p.payload.value.token.value?.value || null,
            memo: p.payload.value.memo.value?.value || null,
          },
          "start-height": Number(p["start-height"].value),
          "end-height": Number(p["end-height"].value),
          eta: p.eta.value ? Number(p.eta.value.value) : null,
          "for-votes": Number(p["for-votes"].value),
          "against-votes": Number(p["against-votes"].value),
          "abstain-votes": Number(p["abstain-votes"].value),
          executed: p.executed.value,
          cancelled: p.cancelled.value,
          "snapshot-supply": Number(p["snapshot-supply"].value),
          "adapter-hash": p["adapter-hash"].value,
        };
      }
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch proposal ${proposalId}:`, error);
    return null;
  }
}

/**
 * Get total number of proposals created
 */
export async function getTotalProposals(): Promise<number> {
  try {
    const network = getNetwork();
    
    const result = await callReadOnlyFunction({
      contractAddress: DEPLOYER,
      contractName: DAO_CORE_NAME,
      functionName: "get-total-proposals",
      functionArgs: [],
      senderAddress: DEPLOYER,
      network,
    });

    if (result) {
      const value = cvToValue(result);
      // get-total-proposals returns next-proposal-id directly (not wrapped in response)
      return Number(value.value || value) - 1; // Subtract 1 since IDs start at 1
    }
    return 0;
  } catch (error) {
    console.error("Failed to fetch total proposals:", error);
    return 0;
  }
}

/**
 * Check if a proposal passes (meets quorum and majority)
 */
export async function checkProposalPasses(proposalId: number): Promise<boolean> {
  try {
    const network = getNetwork();
    
    const result = await callReadOnlyFunction({
      contractAddress: DEPLOYER,
      contractName: DAO_CORE_NAME,
      functionName: "proposal-passes",
      functionArgs: [uintCV(proposalId)],
      senderAddress: DEPLOYER,
      network,
    });

    if (result) {
      const value = cvToValue(result);
      return value.value?.value === true;
    }
    return false;
  } catch (error) {
    console.error(`Failed to check proposal ${proposalId} passes:`, error);
    return false;
  }
}

/**
 * Fetch multiple proposals by ID range
 */
export async function getProposals(
  startId: number = 1,
  limit: number = 10
): Promise<Proposal[]> {
  const proposals: Proposal[] = [];
  const total = await getTotalProposals();
  const endId = Math.min(startId + limit - 1, total);

  for (let id = startId; id <= endId; id++) {
    const proposal = await getProposal(id);
    if (proposal) {
      proposals.push(proposal);
    }
  }

  return proposals;
}
