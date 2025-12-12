"use client";

import { useState } from "react";
import { useWallet } from "./wallet-provider";

export function ConnectButton() {
  const { address, handleConnect, handleDisconnect } = useWallet();
  const [busy, setBusy] = useState(false);

  const short = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  const onClick = async () => {
    if (busy) return;
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
      className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10"
    >
      {busy ? "..." : address ? `Disconnect ${short}` : "Connect wallet"}
    </button>
  );
}
