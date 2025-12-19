"use client";

import {
  callReadOnlyFunction,
  cvToValue,
  standardPrincipalCV,
  uintCV,
} from "@stacks/transactions";
import { StacksMainnet } from "@stacks/network";

const network = new StacksMainnet();
const CONTRACT_ADDRESS = "SP000000000000000000002Q6VF78"; // Placeholder - update with deployed address
const CONTRACT_NAME = "dao-core";

export type ProposalStatus = "Voting" | "Queued" | "Ready" | "Executed" | "Cancelled" | "Failed";

export interface Proposal {
  id: number;
  proposer: string;
  title: string;
  description: string;
  kind: string;
  amount: number;
  recipient: string;
  startHeight: number;
  endHeight: number;
  eta: number | null;
  forVotes: number;
  againstVotes: number;
  abstainVotes: number;
  executed: boolean;
  cancelled: boolean;
  status: ProposalStatus;
  blocksRemaining?: number;
  hoursRemaining?: number;
}

export interface DAOStats {
  totalProposals: number;
  activeProposals: number;
  totalVotes: number;
  treasuryBalance: number;
}

function deriveStatus(proposal: any, currentHeight: number): ProposalStatus {
  if (proposal.cancelled) return "Cancelled";
  if (proposal.executed) return "Executed";
  
  if (currentHeight < proposal.endHeight) {
    return "Voting";
  }
  
  const passed = proposal.forVotes > proposal.againstVotes;
  if (!passed) return "Failed";
  
  if (!proposal.eta) return "Queued";
  if (currentHeight < proposal.eta) return "Queued";
  
  return "Ready";
}

export async function getProposalCount(): Promise<number> {
  try {
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "get-next-proposal-id",
      functionArgs: [],
      senderAddress: CONTRACT_ADDRESS,
    });
    
    const value = cvToValue(result);
    return Number(value) - 1;
  } catch (error) {
    console.error("Error fetching proposal count:", error);
    return 0;
  }
}

export async function getProposal(id: number): Promise<Proposal | null> {
  try {
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "get-proposal",
      functionArgs: [uintCV(id)],
      senderAddress: CONTRACT_ADDRESS,
    });
    
    const value = cvToValue(result);
    if (!value || value.value === null) return null;
    
    const proposal = value.value;
    const currentHeight = 150000; // Mock - in production, fetch from API
    
    const blocksRemaining = Math.max(0, Number(proposal.endHeight) - currentHeight);
    const hoursRemaining = Math.floor(blocksRemaining / 6);
    
    return {
      id,
      proposer: proposal.proposer,
      title: `Proposal #${id}`,
      description: proposal.payload?.memo?.value || `${proposal.payload?.kind} transfer`,
      kind: proposal.payload?.kind || "stx-transfer",
      amount: Number(proposal.payload?.amount || 0),
      recipient: proposal.payload?.recipient || "",
      startHeight: Number(proposal.startHeight),
      endHeight: Number(proposal.endHeight),
      eta: proposal.eta ? Number(proposal.eta) : null,
      forVotes: Number(proposal.forVotes),
      againstVotes: Number(proposal.againstVotes),
      abstainVotes: Number(proposal.abstainVotes),
      executed: proposal.executed,
      cancelled: proposal.cancelled,
      status: deriveStatus(proposal, currentHeight),
      blocksRemaining,
      hoursRemaining,
    };
  } catch (error) {
    console.error(`Error fetching proposal ${id}:`, error);
    return null;
  }
}

export async function getAllProposals(): Promise<Proposal[]> {
  const count = await getProposalCount();
  const proposals: Proposal[] = [];
  
  for (let i = 1; i <= count; i++) {
    const proposal = await getProposal(i);
    if (proposal) proposals.push(proposal);
  }
  
  return proposals.sort((a, b) => b.id - a.id);
}

export async function getDAOStats(): Promise<DAOStats> {
  const proposals = await getAllProposals();
  const activeProposals = proposals.filter(p => p.status === "Voting").length;
  const totalVotes = proposals.reduce((sum, p) => 
    sum + p.forVotes + p.againstVotes + p.abstainVotes, 0
  );
  
  return {
    totalProposals: proposals.length,
    activeProposals,
    totalVotes,
    treasuryBalance: 0, // Mock - fetch from treasury contract
  };
}

export async function hasVoted(proposalId: number, voterAddress: string): Promise<boolean> {
  try {
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "get-receipt",
      functionArgs: [uintCV(proposalId), standardPrincipalCV(voterAddress)],
      senderAddress: CONTRACT_ADDRESS,
    });
    
    const value = cvToValue(result);
    return value && value.value !== null;
  } catch (error) {
    return false;
  }
}
