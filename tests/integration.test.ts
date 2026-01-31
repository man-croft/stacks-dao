import { describe, expect, it } from "vitest";
import { Cl, cvToValue } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const wallet1 = accounts.get("wallet_1")!;

describe("Full DAO Lifecycle Integration", () => {
  it("runs the complete governance flow", () => {
    // 1. Setup
    simnet.callPublicFn("dao-treasury-v1", "init", [Cl.contractPrincipal(deployer, "dao-core-v1"), Cl.contractPrincipal(deployer, "transfer-adapter-v1"), Cl.bool(true)], deployer);
    simnet.callPublicFn("transfer-adapter-v1", "set-core", [Cl.contractPrincipal(deployer, "dao-core-v1")], deployer);
    simnet.transferSTX(1000, `${deployer}.dao-treasury-v1`, deployer);

    // 2. Propose
    const proposalId = Cl.uint(1);
    const payload = Cl.tuple({
      kind: Cl.stringAscii("stx-transfer"),
      amount: Cl.uint(50),
      recipient: Cl.principal(wallet1),
      token: Cl.none(),
      memo: Cl.none(),
    });
    
    const propose = simnet.callPublicFn(
      "dao-core-v1",
      "propose",
      [Cl.contractPrincipal(deployer, "transfer-adapter-v1"), payload],
      deployer
    );
    expect(propose.result).toBeOk(proposalId);

    // 3. Vote
    const voters = simnet.getAccounts().values();
    let votes = 0;
    for (const voter of voters) {
      if (votes >= 10) break; // Need 10 votes for quorum
      const vote = simnet.callPublicFn("dao-core-v1", "cast-vote", [proposalId, Cl.uint(1)], voter);
      expect(vote.result).toBeOk(Cl.bool(true));
      votes++;
    }

    // 4. Queue (Advance blocks)
    simnet.mineEmptyBlocks(2101); // Voting period
    const queue = simnet.callPublicFn("dao-core-v1", "queue", [proposalId], deployer);
    expect(queue.result).toBeOk(Cl.bool(true));

    // 5. Execute (Advance blocks)
    simnet.mineEmptyBlocks(101); // Timelock
    const execute = simnet.callPublicFn(
      "dao-core-v1",
      "execute",
      [proposalId, Cl.contractPrincipal(deployer, "transfer-adapter-v1"), Cl.contractPrincipal(deployer, "dao-core-v1")],
      deployer
    );
    expect(execute.result).toBeOk(Cl.bool(true));
  });
});
