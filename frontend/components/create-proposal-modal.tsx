"use client";

import { useState } from "react";
import { openContractCall } from "@stacks/connect";
import { 
  uintCV, 
  stringAsciiCV, 
  standardPrincipalCV, 
  someCV, 
  noneCV, 
  bufferCV,
  tupleCV 
} from "@stacks/transactions";
import { StacksMainnet } from "@stacks/network";

interface CreateProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateProposalModal({ isOpen, onClose, onSuccess }: CreateProposalModalProps) {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [memo, setMemo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Validate inputs
      if (!amount || parseFloat(amount) <= 0) {
        setError("Amount must be greater than 0");
        setSubmitting(false);
        return;
      }

      if (!recipient || !recipient.startsWith("SP") || recipient.length < 40) {
        setError("Invalid Stacks address");
        setSubmitting(false);
        return;
      }

      const amountMicroStx = Math.floor(parseFloat(amount) * 1_000_000);
      
      // Build payload tuple exactly as contract expects
      const payloadCV = tupleCV({
        kind: stringAsciiCV("stx-transfer"),
        amount: uintCV(amountMicroStx),
        recipient: standardPrincipalCV(recipient),
        token: noneCV(),
        memo: memo.trim() 
          ? someCV(bufferCV(Buffer.from(memo.slice(0, 34)))) 
          : noneCV(),
      });

      await openContractCall({
        network: new StacksMainnet(),
        contractAddress: "SP000000000000000000002Q6VF78", // Update with deployed address
        contractName: "dao-core",
        functionName: "propose",
        functionArgs: [payloadCV],
        onFinish: (data) => {
          console.log("Proposal created:", data);
          setAmount("");
          setRecipient("");
          setMemo("");
          onClose();
          onSuccess?.();
        },
        onCancel: () => {
          setSubmitting(false);
        },
      });
    } catch (error) {
      console.error("Create proposal error:", error);
      setError(error instanceof Error ? error.message : "Failed to create proposal");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/20 shadow-2xl p-8"
        style={{ animation: "fadeIn 0.3s ease-out" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Create Proposal</h2>
        <p className="text-sm text-white/60 mb-6">
          Propose a treasury STX transfer. Voting period: ~1 day (2,100 blocks)
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Info Box */}
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-sm text-blue-200">
            <div className="flex items-start gap-2">
              <span className="text-lg">ℹ️</span>
              <div>
                <p className="font-medium mb-1">Contract Requirements:</p>
                <ul className="text-xs text-blue-200/80 space-y-1">
                  <li>• Only STX transfers supported (MVP)</li>
                  <li>• Quorum: 10% of supply must vote</li>
                  <li>• Pass condition: FOR &gt; AGAINST</li>
                  <li>• Timelock: 100 blocks after queue</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Amount (STX) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.000001"
                min="0.000001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="100.0"
              />
              {amount && (
                <div className="mt-1 text-xs text-white/50">
                  = {(parseFloat(amount) * 1_000_000).toLocaleString()} μSTX
                </div>
              )}
            </div>
          </div>

          {/* Recipient */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Recipient Address *
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value.trim())}
              required
              maxLength={42}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono text-sm"
              placeholder="SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
            />
            {recipient && !recipient.startsWith("SP") && (
              <div className="mt-1 text-xs text-red-400">
                ⚠️ Address must start with SP
              </div>
            )}
          </div>

          {/* Memo */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Description (max 34 chars)
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value.slice(0, 34))}
              rows={2}
              maxLength={34}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
              placeholder="Team payment Q4 2024"
            />
            <div className="mt-1 text-xs text-white/50 text-right">
              {memo.length}/34
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 text-white/80 font-medium hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:from-purple-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Create Proposal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
