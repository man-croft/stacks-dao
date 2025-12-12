import { ConnectButton } from "@/components/connect-button";
import { WalletProvider } from "@/components/wallet-provider";

export default function Home() {
  return (
    <WalletProvider>
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6">
        <h1 className="text-3xl font-semibold">Stacks DAO Frontend</h1>
        <p className="text-center text-sm text-white/70 max-w-md">
          Connect your Stacks wallet to interact with the DAO. No styling polish
          yet—this is a barebones wiring for wallet auth using @stacks/connect.
        </p>
        <ConnectButton />
      </main>
    </WalletProvider>
  );
}
