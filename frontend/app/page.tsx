import { ConnectButton } from "@/components/connect-button";
import { WalletProvider } from "@/components/wallet-provider";
import { ProposalList } from "@/components/proposal-list";
import { SearchBar } from "@/components/search-bar";
import Link from "next/link";

export default function Home() {
  return (
    <WalletProvider>
      <main className="min-h-screen px-6 py-12 flex items-center justify-center">
        <section className="w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl px-8 py-10 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Stacks DAO</p>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                Govern the treasury
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/proposals/create" className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-500/20 transition">
                + New Proposal
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <ProposalList />
            </div>

            <div className="space-y-6">
              <SearchBar />
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 shadow-inner">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>Connect your wallet</span>
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide">Auth</span>
                </div>
                <div className="mt-4">
                  <ConnectButton />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </WalletProvider>
  );
}
