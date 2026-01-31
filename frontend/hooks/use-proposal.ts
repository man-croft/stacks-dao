import { useCallback, useEffect, useState } from "react";
import { callReadOnlyFunction, cvToValue, uintCV, ResponseOkCV, TupleCV } from "@stacks/transactions";
import { getApiUrl, getContractOwner } from "@/lib/constants";
import { StacksMocknet, StacksTestnet, StacksMainnet } from "@stacks/network";

const DEPLOYER = getContractOwner();
const CONTRACT_NAME = "dao-core-v1";

export type ProposalData = {
  proposer: string;
  "for-votes": number;
  "against-votes": number;
  executed: boolean;
  cancelled: boolean;
  "end-height": number;
};

export function useProposal(id: number) {
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProposal = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, you'd pick the network based on env
      const network = new StacksMocknet({ url: getApiUrl() }); 
      
      const result = await callReadOnlyFunction({
        contractAddress: DEPLOYER,
        contractName: CONTRACT_NAME,
        functionName: "get-proposal",
        functionArgs: [uintCV(id)],
        senderAddress: DEPLOYER,
        network,
      });

      if (result) {
        const value = cvToValue(result);
        if (value && value.value) {
           setProposal(value.value); 
        } else {
          setProposal(null);
        }
      }
    } catch (e) {
      console.error(e);
      setError("Failed to fetch proposal details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProposal();
  }, [fetchProposal]);

  return { proposal, loading, error, refetch: fetchProposal };
}
