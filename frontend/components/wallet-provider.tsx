"use client";

import { AppConfig, UserSession } from "@stacks/connect";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type WalletContextValue = {
  userSession: UserSession;
  address: string | null;
  handleConnect: () => Promise<void>;
  handleDisconnect: () => void;
  connecting: boolean;
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const populate = async () => {
      if (userSession.isSignInPending()) {
        await userSession.handlePendingSignIn();
      }

      if (userSession.isUserSignedIn()) {
        const profile = userSession.loadUserData();
        const stxAddress =
          profile?.profile?.stxAddress?.mainnet ||
          profile?.profile?.stxAddress?.testnet ||
          null;
        setAddress(stxAddress);
      }
    };

    void populate();
  }, []);

  const handleConnect = async () => {
    if (connecting) return;
    setConnecting(true);
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
          setConnecting(false);
          resolve();
        },
        onCancel: () => {
          setConnecting(false);
          reject(new Error("User cancelled connect"));
        },
      });
    });
  };

  const handleDisconnect = () => {
    userSession.signUserOut();
    setAddress(null);
    setConnecting(false);
  };

  const value = useMemo(
    () => ({
      userSession,
      address,
      handleConnect,
      handleDisconnect,
      connecting,
    }),
    [address, connecting]
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
