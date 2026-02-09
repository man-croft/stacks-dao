import {
  makeStandardSTXPostCondition,
  makeStandardFungiblePostCondition,
  makeContractSTXPostCondition,
  makeContractFungiblePostCondition,
  FungibleConditionCode,
  createAssetInfo,
} from "@stacks/transactions";

/**
 * Post-condition builders for DAO transactions
 * 
 * Post-conditions protect users by ensuring transactions only execute
 * if specific conditions are met (e.g., exact token amounts transferred).
 * 
 * @see https://docs.stacks.co/stacks-101/post-conditions
 */

/**
 * Create post-condition for STX transfer from treasury
 */
export function treasuryStxTransferPostCondition(
  treasuryAddress: string,
  treasuryName: string,
  amount: bigint
) {
  return makeContractSTXPostCondition(
    treasuryAddress,
    treasuryName,
    FungibleConditionCode.Equal,
    amount
  );
}

/**
 * Create post-condition for FT transfer from treasury
 */
export function treasuryFtTransferPostCondition(
  treasuryAddress: string,
  treasuryName: string,
  tokenAddress: string,
  tokenName: string,
  assetName: string,
  amount: bigint
) {
  const assetInfo = createAssetInfo(tokenAddress, tokenName, assetName);
  return makeContractFungiblePostCondition(
    treasuryAddress,
    treasuryName,
    FungibleConditionCode.Equal,
    amount,
    assetInfo
  );
}

/**
 * Create post-condition ensuring user sends exactly N STX
 */
export function userStxSendPostCondition(
  userAddress: string,
  amount: bigint
) {
  return makeStandardSTXPostCondition(
    userAddress,
    FungibleConditionCode.Equal,
    amount
  );
}

/**
 * Create post-condition ensuring user sends exactly N tokens
 */
export function userFtSendPostCondition(
  userAddress: string,
  tokenAddress: string,
  tokenName: string,
  assetName: string,
  amount: bigint
) {
  const assetInfo = createAssetInfo(tokenAddress, tokenName, assetName);
  return makeStandardFungiblePostCondition(
    userAddress,
    FungibleConditionCode.Equal,
    amount,
    assetInfo
  );
}

/**
 * Create post-condition ensuring user doesn't lose any STX
 * Useful for read-like transactions that shouldn't transfer funds
 */
export function noStxLossPostCondition(userAddress: string) {
  return makeStandardSTXPostCondition(
    userAddress,
    FungibleConditionCode.Equal,
    BigInt(0)
  );
}

/**
 * Parse a full contract identifier into address and name
 * @example "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.my-token" -> { address: "ST1...", name: "my-token" }
 */
export function parseContractId(contractId: string): { address: string; name: string } {
  const [address, name] = contractId.split(".");
  if (!address || !name) {
    throw new Error(`Invalid contract identifier: ${contractId}`);
  }
  return { address, name };
}
