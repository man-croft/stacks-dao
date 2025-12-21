"use client";

import { useState } from "react";
import { useWallet } from "./wallet-provider";

export function ConnectButton() {
  const { address, handleConnect, handleDisconnect, connecting } = useWallet();
  const [busy, setBusy] = useState(false);

  const short = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  const statusLabel = (() => {
    if (busy || connecting) return "Connecting";
    if (address) return `Disconnect ${short}`;
    return "Connect wallet";
  })();

  const onClick = async () => {
    if (busy || connecting) return;
    try {
      setBusy(true);
      if (address) {
        handleDisconnect();
      } else {
        await handleConnect();
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={onClick}
      className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition duration-150 hover:-translate-y-[1px] hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={busy || connecting}
      aria-busy={busy || connecting}
      data-state={address ? "connected" : "disconnected"}
      title={address || undefined}
    >
      {statusLabel}
    </button>
  );
}
