import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const proposer = accounts.get("wallet_1")!;

describe("dao-core parameter hardening", () => {
  it("fails to queue if voting is not over (ERR_VOTING_NOT_OVER)", () => {
    // 1. Propose
    const payload = Cl.tuple({
      kind: Cl.stringAscii("stx-transfer"),
      amount: Cl.uint(100),
      recipient: Cl.principal(deployer),
      token: Cl.none(),
      memo: Cl.none(),
    });

    const proposal = simnet.callPublicFn(
      "dao-core-v1",
      "propose",
      [Cl.contractPrincipal(deployer, "transfer-adapter-v1"), payload],
      proposer
    );
    const pid = (proposal.result as any).value; // u1

    // 2. Try to queue immediately (voting period active)
    const queue = simnet.callPublicFn(
      "dao-core-v1",
      "queue",
      [pid],
      proposer
    );
    
    // Expect ERR_VOTING_NOT_OVER (u103)
    expect(queue.result).toBeErr(Cl.uint(103)); 
  });
});
