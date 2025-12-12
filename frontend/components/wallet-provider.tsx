"use client";

import {
  connect,
  disconnect,
  getLocalStorage,
  isConnected,
} from "@stacks/connect";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type WalletContextValue = {
  address: string | null;
  handleConnect: () => Promise<void>;
  handleDisconnect: () => void;
  connecting: boolean;
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (!isConnected()) return;
    const cache = getLocalStorage();
    const stored =
      cache?.addresses?.stx?.[0]?.address ||
      cache?.addresses?.btc?.[0]?.address ||
      null;
    setAddress(stored);
  }, []);

  const handleConnect = useCallback(async () => {
    if (connecting) return;
    setConnecting(true);
    try {
      const response = await connect();
      const stxAddress =
        response?.addresses?.stx?.[0]?.address ||
        response?.addresses?.[0]?.address ||
        null;
      setAddress(stxAddress);
    } finally {
      setConnecting(false);
    }
  }, [connecting]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setAddress(null);
    setConnecting(false);
  }, []);

  const value = useMemo(
    () => ({
      address,
      handleConnect,
      handleDisconnect,
      connecting,
    }),
    [address, connecting, handleConnect, handleDisconnect]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
