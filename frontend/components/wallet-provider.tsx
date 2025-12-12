"use client";

import { AppConfig, UserSession } from "@stacks/connect";
import React, { createContext, useContext, useMemo, useState } from "react";

type WalletContextValue = {
  userSession: UserSession;
  address: string | null;
  handleConnect: () => Promise<void>;
  handleDisconnect: () => void;
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);

  const handleConnect = async () => {
    return new Promise<void>((resolve, reject) => {
      userSession.authenticate({
        appDetails: {
          name: "Stacks DAO",
          icon: `${window.location.origin}/favicon.ico`,
        },
        onFinish: () => {
          const profile = userSession.loadUserData();
          const stxAddress =
            profile?.profile?.stxAddress?.mainnet ||
            profile?.profile?.stxAddress?.testnet ||
            null;
          setAddress(stxAddress);
          resolve();
        },
        onCancel: () => reject(new Error("User cancelled connect")),
      });
    });
  };

  const handleDisconnect = () => {
    userSession.signUserOut();
    setAddress(null);
  };

  const value = useMemo(
    () => ({
      userSession,
      address,
      handleConnect,
      handleDisconnect,
    }),
    [address]
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
