import { STACKS_NETWORK_ENV } from "./constants";

export function getExplorerTxLink(txId: string) {
  // Assuming default hiro explorer
  const baseUrl = "https://explorer.hiro.so";
  const chain = STACKS_NETWORK_ENV === "mainnet" ? "mainnet" : "testnet";
  // Simnet/Devnet doesn't really have an explorer unless configured
  if (STACKS_NETWORK_ENV === "devnet") return `http://localhost:8000/tx/${txId}?chain=testnet`;
  
  return `${baseUrl}/txid/${txId}?chain=${chain}`;
}
