export const STACKS_NETWORK_ENV = process.env.NEXT_PUBLIC_STACKS_NETWORK || "devnet";

export const DEVNET_API = "http://localhost:3999";
export const TESTNET_API = "https://api.testnet.hiro.so";
export const MAINNET_API = "https://api.mainnet.hiro.so";

export const getApiUrl = () => {
  if (STACKS_NETWORK_ENV === "mainnet") return MAINNET_API;
  if (STACKS_NETWORK_ENV === "testnet") return TESTNET_API;
  return DEVNET_API;
};

export const CONTRACT_ADDRESS_DEVNET = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
export const CONTRACT_ADDRESS_TESTNET = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";

export const getContractOwner = () => {
  if (STACKS_NETWORK_ENV === "mainnet") return ""; // TODO
  if (STACKS_NETWORK_ENV === "testnet") return CONTRACT_ADDRESS_TESTNET;
  return CONTRACT_ADDRESS_DEVNET;
};
