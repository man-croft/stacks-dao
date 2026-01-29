import {
  uintCV,
  stringAsciiCV,
  principalCV,
  noneCV,
  tupleCV,
  someCV,
  contractPrincipalCV,
  standardPrincipalCV,
} from "@stacks/transactions";

export const buildTransferPayload = (recipient: string, amount: number) => {
  return tupleCV({
    kind: stringAsciiCV("stx-transfer"),
    amount: uintCV(amount),
    recipient: principalCV(recipient), // Auto-detects standard/contract
    token: noneCV(),
    memo: noneCV(),
  });
};
