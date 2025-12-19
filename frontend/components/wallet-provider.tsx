"use client";

import {
  showConnect,
  disconnect,
  AppConfig,
  UserSession,
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

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const stxAddress = userData.profile.stxAddress.mainnet || null;
      setAddress(stxAddress);
    }
  }, []);

  const handleConnect = useCallback(async () => {
    if (connecting) return;
    setConnecting(true);
    try {
      await showConnect({
        appDetails: {
          name: "Stacks DAO",
          icon: typeof window !== 'undefined' ? window.location.origin + "/favicon.ico" : "",
        },
        onFinish: () => {
          if (userSession.isUserSignedIn()) {
            const userData = userSession.loadUserData();
            const stxAddress = userData.profile.stxAddress.mainnet || null;
            setAddress(stxAddress);
          }
          setConnecting(false);
        },
        onCancel: () => {
          setConnecting(false);
        },
        userSession,
      });
    } catch (error) {
      setConnecting(false);
    }
  }, [connecting]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    userSession.signUserOut();
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
