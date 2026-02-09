"use client";

import {
  showConnect,
  disconnect,
  UserSession,
  AppConfig,
} from "@stacks/connect";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { STACKS_NETWORK_ENV } from "@/lib/constants";

const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });

type WalletContextValue = {
  address: string | null;
  handleConnect: () => void;
  handleDisconnect: () => void;
  connecting: boolean;
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

/**
 * Get the appropriate STX address based on network environment
 */
function getStxAddress(userData: { profile: { stxAddress: { mainnet: string; testnet: string } } }): string {
  if (STACKS_NETWORK_ENV === "mainnet") {
    return userData.profile.stxAddress.mainnet;
  }
  // Both testnet and devnet use testnet addresses
  return userData.profile.stxAddress.testnet;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setAddress(getStxAddress(userData));
    }
  }, []);

  const handleConnect = useCallback(() => {
    if (connecting) return;
    setConnecting(true);
    showConnect({
      appDetails: {
        name: "Stacks DAO",
        icon: typeof window !== "undefined" ? window.location.origin + "/favicon.ico" : "",
      },
      redirectTo: "/",
      onFinish: () => {
        const userData = userSession.loadUserData();
        setAddress(getStxAddress(userData));
        setConnecting(false);
      },
      onCancel: () => {
        setConnecting(false);
      },
    });
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
