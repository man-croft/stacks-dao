"use client";

import { useState } from "react";
import { useWallet } from "@/components/wallet-provider";

export type TransferKind = "stx-transfer" | "ft-transfer";

export interface ProposalFormData {
  kind: TransferKind;
  amount: string;
  recipient: string;
  token?: string;
  memo?: string;
}

export function CreateProposalForm({
  onSubmit,
}: {
  onSubmit: (data: ProposalFormData) => void;
}) {
  const { address } = useWallet();
  const [kind, setKind] = useState<TransferKind>("stx-transfer");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [token, setToken] = useState("");
  const [memo, setMemo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: ProposalFormData = {
      kind,
      amount,
      recipient,
    };
    
    if (kind === "ft-transfer") {
      data.token = token;
      if (memo.trim()) {
        data.memo = memo;
      }
    }
    
    onSubmit(data);
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
      {/* Transfer Type Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">
          Transfer Type
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setKind("stx-transfer")}
            className={`flex-1 rounded-xl border py-3 font-medium transition ${
              kind === "stx-transfer"
                ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-400"
                : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            STX Transfer
          </button>
          <button
            type="button"
            onClick={() => setKind("ft-transfer")}
            className={`flex-1 rounded-xl border py-3 font-medium transition ${
              kind === "ft-transfer"
                ? "border-purple-400/50 bg-purple-500/10 text-purple-400"
                : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            Token Transfer
          </button>
        </div>
      </div>

      {/* Recipient Address */}
      <div className="space-y-2">
        <label htmlFor="recipient" className="text-sm font-medium text-white/70">
          Recipient Address
        </label>
        <input
          id="recipient"
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="ST... or SP..."
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/50"
          required
        />
      </div>

      {/* Token Contract (FT only) */}
      {kind === "ft-transfer" && (
        <div className="space-y-2">
          <label htmlFor="token" className="text-sm font-medium text-white/70">
            Token Contract
          </label>
          <input
            id="token"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ST...::token-name"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 focus:border-purple-400/50 focus:outline-none focus:ring-1 focus:ring-purple-400/50"
            required
          />
          <p className="text-xs text-white/40">
            Full contract identifier (e.g., ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.my-token)
          </p>
        </div>
      )}

      {/* Amount */}
      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium text-white/70">
          Amount {kind === "stx-transfer" ? "(uSTX)" : "(smallest unit)"}
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

      {/* Memo (FT only) */}
      {kind === "ft-transfer" && (
        <div className="space-y-2">
          <label htmlFor="memo" className="text-sm font-medium text-white/70">
            Memo (optional)
          </label>
          <input
            id="memo"
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Transfer memo..."
            maxLength={34}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 focus:border-purple-400/50 focus:outline-none focus:ring-1 focus:ring-purple-400/50"
          />
          <p className="text-xs text-white/40">
            Max 34 characters
          </p>
        </div>
      )}

      <button
        type="submit"
        className={`w-full rounded-xl py-4 font-medium text-white transition ${
          kind === "stx-transfer"
            ? "bg-emerald-500 hover:bg-emerald-600"
            : "bg-purple-500 hover:bg-purple-600"
        }`}
      >
        Submit {kind === "stx-transfer" ? "STX" : "Token"} Transfer Proposal
      </button>
    </form>
  );
}
