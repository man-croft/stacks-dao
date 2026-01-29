"use client";

import { CreateProposalForm } from "@/components/create-proposal-form";
import { openContractCall } from "@stacks/connect";
import { buildTransferPayload } from "@/lib/contracts";
import { getContractOwner } from "@/lib/constants";
import { contractPrincipalCV } from "@stacks/transactions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getExplorerTxLink } from "@/lib/explorer";

export default function CreateProposalPage() {
  const router = useRouter();
  const owner = getContractOwner();

  const handlePropose = async (data: { amount: string; recipient: string }) => {
    const payload = buildTransferPayload(data.recipient, Number(data.amount));
    // Assuming standard naming convention for the adapter
    const adapter = contractPrincipalCV(owner, "transfer-adapter-v1");

    await openContractCall({
      contractAddress: owner,
      contractName: "dao-core-v1",
      functionName: "propose",
      functionArgs: [adapter, payload],
      onFinish: (data) => {
        toast.success("Proposal broadcasted!", {
          description: "It may take a few minutes to appear.",
          action: {
            label: "View on Explorer",
            onClick: () => window.open(getExplorerTxLink(data.txId), "_blank"),
          },
        });
        router.push("/");
      },
      onCancel: () => {
        toast("Proposal cancelled");
      }
    });
  };

  return (
    <main className="min-h-screen px-6 py-12 flex justify-center">
      <div className="w-full max-w-xl space-y-8">
        <Link href="/" className="text-sm text-white/50 hover:text-white transition">
          ← Cancel
        </Link>
        
        <div>
          <h1 className="text-3xl font-bold text-white/90">Create Proposal</h1>
          <p className="text-white/60 mt-2">
            Propose a new transfer from the treasury.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <CreateProposalForm onSubmit={handlePropose} />
        </div>
      </div>
    </main>
  );
}
