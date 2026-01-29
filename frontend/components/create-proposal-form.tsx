"use client";

import { useState } from "react";
import { useWallet } from "@/components/wallet-provider";

export function CreateProposalForm({
  onSubmit,
}: {
  onSubmit: (data: { amount: string; recipient: string }) => void;
}) {
  const { address } = useWallet();
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ amount, recipient });
  };

  if (!address) {
    return (
      <div className="p-8 text-center border border-white/10 rounded-2xl bg-white/5">
        <p className="text-white/60">Connect your wallet to create a proposal.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="recipient" className="text-sm font-medium text-white/70">
          Recipient Address
        </label>
        <input
          id="recipient"
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="ST..."
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/50"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium text-white/70">
          Amount (uSTX)
        </label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="1000000"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/50"
          required
          min="1"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-500 py-4 font-medium text-white hover:bg-emerald-600 transition"
      >
        Submit Proposal
      </button>
    </form>
  );
}
