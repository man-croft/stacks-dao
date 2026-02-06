// ============================================================================
// Network Configuration
// ============================================================================

export type NetworkEnvironment = "devnet" | "testnet" | "mainnet";

export const STACKS_NETWORK_ENV: NetworkEnvironment =
  (process.env.NEXT_PUBLIC_STACKS_NETWORK as NetworkEnvironment) || "devnet";

// API Endpoints
export const DEVNET_API = "http://localhost:3999";
export const TESTNET_API = "https://api.testnet.hiro.so";
export const MAINNET_API = "https://api.mainnet.hiro.so";

/**
 * Get the API URL for the current network environment
 */
export const getApiUrl = (): string => {
  switch (STACKS_NETWORK_ENV) {
    case "mainnet":
      return MAINNET_API;
    case "testnet":
      return TESTNET_API;
    default:
      return DEVNET_API;
  }
};

// ============================================================================
// Contract Addresses
// ============================================================================

// Devnet deployer address (Clarinet default)
export const CONTRACT_ADDRESS_DEVNET = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";

// Testnet deployer address - can be overridden via env var
export const CONTRACT_ADDRESS_TESTNET =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";

// Mainnet deployer address - MUST be set via env var before mainnet deployment
export const CONTRACT_ADDRESS_MAINNET =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MAINNET || "";

/**
 * Get the contract owner/deployer address for the current network
 * @throws Error if mainnet address is not configured
 */
export const getContractOwner = (): string => {
  switch (STACKS_NETWORK_ENV) {
    case "mainnet":
      if (!CONTRACT_ADDRESS_MAINNET) {
        throw new Error(
          "Mainnet contract address not configured. " +
            "Set NEXT_PUBLIC_CONTRACT_ADDRESS_MAINNET environment variable."
        );
      }
      return CONTRACT_ADDRESS_MAINNET;
    case "testnet":
      return CONTRACT_ADDRESS_TESTNET;
    default:
      return CONTRACT_ADDRESS_DEVNET;
  }
};

// ============================================================================
// Contract Names
// ============================================================================

export const CONTRACT_NAMES = {
  DAO_CORE: "dao-core-v1",
  DAO_TREASURY: "dao-treasury-v1",
  TRANSFER_ADAPTER: "transfer-adapter-v1",
} as const;

/**
 * Get fully qualified contract identifier
 * @example getContractId("dao-core-v1") => "ST1PQ...ZGM.dao-core-v1"
 */
export const getContractId = (contractName: string): string => {
  return `${getContractOwner()}.${contractName}`;
};

// ============================================================================
// Governance Constants (mirror of on-chain values)
// ============================================================================

export const GOVERNANCE_DEFAULTS = {
  QUORUM_PERCENT: 10,
  PROPOSAL_THRESHOLD_PERCENT: 1,
  VOTING_PERIOD_BLOCKS: 2100, // ~2 weeks at ~10 min/block
  TIMELOCK_BLOCKS: 100, // ~16 hours at ~10 min/block
  ASSUMED_TOTAL_SUPPLY: 100, // For 1p1v voting model
} as const;

// Vote choice constants (matches on-chain)
export const VOTE_CHOICES = {
  AGAINST: 0,
  FOR: 1,
  ABSTAIN: 2,
} as const;

// ============================================================================
// Explorer URLs
// ============================================================================

export const EXPLORER_URLS = {
  devnet: "http://localhost:8000",
  testnet: "https://explorer.hiro.so/?chain=testnet",
  mainnet: "https://explorer.hiro.so",
} as const;

/**
 * Get explorer URL for the current network
 */
export const getExplorerUrl = (): string => {
  return EXPLORER_URLS[STACKS_NETWORK_ENV];
};

/**
 * Get transaction explorer URL
 */
export const getTxExplorerUrl = (txId: string): string => {
  const base = getExplorerUrl();
  if (STACKS_NETWORK_ENV === "devnet") {
    return `${base}/txid/${txId}`;
  }
  return `${base}/txid/${txId}`;
};
