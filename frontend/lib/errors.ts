/**
 * Contract Error Code Mapping
 * 
 * Maps numeric error codes from Clarity contracts to user-friendly messages.
 * Error codes are defined in contracts/dao-core.clar and contracts/dao-treasury.clar
 */

// ============================================================================
// DAO Core Error Codes (u100-u199)
// ============================================================================

export const DAO_CORE_ERRORS: Record<number, { code: string; message: string; action?: string }> = {
  102: {
    code: "ERR_PROPOSAL_MISSING",
    message: "Proposal not found",
    action: "Check that the proposal ID is correct",
  },
  103: {
    code: "ERR_VOTING_NOT_OVER",
    message: "Voting period is still active",
    action: "Wait for the voting period to end before queuing",
  },
  104: {
    code: "ERR_VOTING_CLOSED",
    message: "Voting is closed for this proposal",
    action: "The proposal has ended, been executed, or was cancelled",
  },
  105: {
    code: "ERR_ALREADY_VOTED",
    message: "You have already voted on this proposal",
    action: "Each address can only vote once per proposal",
  },
  106: {
    code: "ERR_ALREADY_QUEUED",
    message: "Proposal is already queued for execution",
    action: "Wait for the timelock period to pass, then execute",
  },
  107: {
    code: "ERR_NOT_QUEUED",
    message: "Proposal must be queued before execution",
    action: "Queue the proposal first after voting ends",
  },
  108: {
    code: "ERR_TOO_EARLY",
    message: "Timelock period has not passed",
    action: "Wait for the timelock period to complete",
  },
  109: {
    code: "ERR_ALREADY_EXECUTED",
    message: "Proposal has already been executed",
    action: "This proposal has already been completed",
  },
  110: {
    code: "ERR_ALREADY_CANCELLED",
    message: "Proposal has already been cancelled",
    action: "Cancelled proposals cannot be modified",
  },
  112: {
    code: "ERR_NOT_PASSED",
    message: "Proposal did not pass",
    action: "The proposal did not meet quorum or majority requirements",
  },
  113: {
    code: "ERR_HASH_CHANGED",
    message: "Adapter integrity check failed",
    action: "The adapter contract was modified. This is a security violation.",
  },
  114: {
    code: "ERR_INSUFFICIENT_POWER",
    message: "Insufficient voting power to create proposal",
    action: "You need more voting power or delegated votes to propose",
  },
  115: {
    code: "ERR_INVALID_PAYLOAD",
    message: "Invalid proposal payload",
    action: "Check that the proposal parameters are correct",
  },
  116: {
    code: "ERR_INVALID_PARAMETER",
    message: "Invalid governance parameter",
    action: "The parameter name is not recognized",
  },
  117: {
    code: "ERR_UNAUTHORIZED",
    message: "Unauthorized action",
    action: "You don't have permission to perform this action",
  },
};

// ============================================================================
// Treasury Error Codes
// ============================================================================

export const TREASURY_ERRORS: Record<number, { code: string; message: string; action?: string }> = {
  101: {
    code: "ERR_UNAUTHORIZED",
    message: "Treasury transfer not authorized",
    action: "Only the DAO can authorize treasury transfers",
  },
};

// ============================================================================
// Transfer Adapter Error Codes
// ============================================================================

export const ADAPTER_ERRORS: Record<number, { code: string; message: string; action?: string }> = {
  100: {
    code: "ERR_DAO_NOT_SET",
    message: "DAO core contract not configured",
    action: "The adapter needs to be initialized with the DAO contract",
  },
  101: {
    code: "ERR_UNAUTHORIZED",
    message: "Unauthorized adapter call",
    action: "Only the DAO core can call the adapter",
  },
  102: {
    code: "ERR_INVALID_KIND",
    message: "Invalid transfer type",
    action: "Transfer kind must be 'stx-transfer' or 'ft-transfer'",
  },
  103: {
    code: "ERR_TOKEN_EXPECTED",
    message: "Token address required for FT transfer",
    action: "Provide the token contract address for fungible token transfers",
  },
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get user-friendly error message from contract error code
 */
export function getErrorMessage(errorCode: number): string {
  const error = 
    DAO_CORE_ERRORS[errorCode] || 
    TREASURY_ERRORS[errorCode] || 
    ADAPTER_ERRORS[errorCode];
  
  if (error) {
    return error.message;
  }
  
  return `Unknown error (code: ${errorCode})`;
}

/**
 * Get detailed error info including suggested action
 */
export function getErrorDetails(errorCode: number): {
  code: string;
  message: string;
  action?: string;
} | null {
  return (
    DAO_CORE_ERRORS[errorCode] || 
    TREASURY_ERRORS[errorCode] || 
    ADAPTER_ERRORS[errorCode] || 
    null
  );
}

/**
 * Parse error code from Clarity error response
 * Handles both (err u123) format and raw numbers
 */
export function parseContractError(error: unknown): number | null {
  if (typeof error === "number") {
    return error;
  }
  
  if (typeof error === "string") {
    // Match patterns like "u123" or "(err u123)"
    const match = error.match(/u(\d+)/);
    if (match) {
      return parseInt(match[1], 10);
    }
  }
  
  // Handle Clarity value objects
  if (error && typeof error === "object" && "value" in error) {
    const value = (error as { value: unknown }).value;
    if (typeof value === "bigint" || typeof value === "number") {
      return Number(value);
    }
  }
  
  return null;
}

/**
 * Format error for display in UI
 */
export function formatContractError(error: unknown): string {
  const code = parseContractError(error);
  if (code !== null) {
    const details = getErrorDetails(code);
    if (details) {
      return `${details.message}${details.action ? ` - ${details.action}` : ""}`;
    }
  }
  
  // Fallback for unknown errors
  if (error instanceof Error) {
    return error.message;
  }
  
  return "Transaction failed. Please try again.";
}
