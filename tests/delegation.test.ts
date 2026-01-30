import { describe, expect, it } from "vitest";
import { Cl, cvToValue } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const delegator = accounts.get("wallet_1")!;
const delegate = accounts.get("wallet_2")!;

const proposalId = Cl.uint(1);
const forChoice = Cl.uint(1);

describe("dao-core delegation", () => {
  it("allows delegation and calculates weight correctly", () => {
    // 1. Initialize & Propose
    const treasury = `${deployer}.dao-treasury-v1`;
    simnet.transferSTX(1000, treasury, deployer);
    simnet.callPublicFn("dao-treasury-v1", "init", [Cl.contractPrincipal(deployer, "dao-core-v1"), Cl.contractPrincipal(deployer, "transfer-adapter-v1"), Cl.bool(true)], deployer);
    simnet.callPublicFn("transfer-adapter-v1", "set-core", [Cl.contractPrincipal(deployer, "dao-core-v1")], deployer);

    const payload = Cl.tuple({
      kind: Cl.stringAscii("stx-transfer"),
      amount: Cl.uint(100),
      recipient: Cl.principal(deployer),
      token: Cl.none(),
      memo: Cl.none(),
    });
    simnet.callPublicFn("dao-core-v1", "propose", [Cl.contractPrincipal(deployer, "transfer-adapter-v1"), payload], deployer);

    // 2. Delegate: Wallet_1 delegates to Wallet_2
    const delegation = simnet.callPublicFn(
      "dao-core-v1",
      "delegate-vote",
      [Cl.principal(delegate)],
      delegator
    );
    expect(delegation.result).toBeOk(Cl.bool(true));

    // 3. Delegate Votes
    // Weight should be 2 (Own 1 + Delegated 1)
    const vote = simnet.callPublicFn(
      "dao-core-v1",
      "cast-vote",
      [proposalId, forChoice],
      delegate
    );
    expect(vote.result).toBeOk(Cl.bool(true));

    // 4. Verify weight
    const tally = cvToValue(
      simnet.getMapEntry("dao-core-v1", "proposals", Cl.tuple({ id: proposalId }))
    ) as any;
    expect(BigInt(tally.value["for-votes"].value)).toBe(2n);
  });
});
