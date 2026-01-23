import { describe, expect, it } from "vitest";
import { Cl, cvToValue } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const proposer = accounts.get("wallet_1")!;
const recipient = accounts.get("wallet_2")!;
const voters = Array.from(accounts.values()).slice(0, 10);

const proposalId = Cl.uint(1);
const forChoice = Cl.uint(1);

const buildPayload = (to: string, amount = 0) =>
  Cl.tuple({
    kind: Cl.stringAscii("stx-transfer"),
    amount: Cl.uint(amount),
    recipient: Cl.principal(to),
    token: Cl.none(),
    memo: Cl.none(),
  });

describe("dao-core governance", () => {
  // Bootstrap the treasury
  it("initializes treasury whitelist", () => {
    const init = simnet.callPublicFn(
      "dao-treasury-v1",
      "init",
      [Cl.contractPrincipal(deployer, "transfer-adapter-v1"), Cl.bool(true)],
      deployer
    );
    expect(init.result).toBeOk(Cl.bool(true));
  });

  it("accepts both stx-transfer and ft-transfer payloads", () => {
    const ftPayload = Cl.tuple({
      kind: Cl.stringAscii("ft-transfer"),
      amount: Cl.uint(100),
      recipient: Cl.principal(recipient),
      token: Cl.some(Cl.principal(`${deployer}.some-token`)),
      memo: Cl.none(),
    });

    const proposal = simnet.callPublicFn(
      "dao-core-v1",
      "propose",
      [ftPayload],
      proposer
    );

    expect(proposal.result).toBeOk(proposalId);
  });

  it("queues and executes a passing proposal", () => {
    const payload = buildPayload(recipient, 100);

    const proposal = simnet.callPublicFn(
      "dao-core-v1",
      "propose",
      [payload],
      proposer
    );
    expect(proposal.result).toBeOk(proposalId);

    voters.forEach((voter) => {
      const vote = simnet.callPublicFn(
        "dao-core-v1",
        "cast-vote",
        [proposalId, forChoice],
        voter
      );
      expect(vote.result).toBeOk(Cl.bool(true));
    });

    const tally = cvToValue(
      simnet.getMapEntry("dao-core-v1", "proposals", Cl.tuple({ id: proposalId }))
    ) as any;
    expect(BigInt(tally.value["for-votes"].value)).toBe(10n);

    const passes = simnet.callReadOnlyFn(
      "dao-core-v1",
      "proposal-passes",
      [proposalId],
      proposer
    );
    expect(passes.result).toBeOk(Cl.bool(true));

    simnet.mineEmptyBlocks(2101);

    const queued = simnet.callPublicFn(
      "dao-core-v1",
      "queue",
      [proposalId],
      proposer
    );
    expect(queued.result).toBeOk(Cl.bool(true));

    simnet.mineEmptyBlocks(101);

    // Pass a dummy trait for STX transfer (e.g. dao-core itself)
    const execute = simnet.callPublicFn(
      "dao-core-v1", 
      "execute", 
      [proposalId, Cl.contractPrincipal(deployer, "dao-core-v1")], 
      proposer
    );
    expect(execute.result).toBeOk(Cl.bool(true));

    const finalState = cvToValue(
      simnet.getMapEntry("dao-core-v1", "proposals", Cl.tuple({ id: proposalId }))
    ) as any;
    expect(finalState.value.executed.value).toBe(true);
  });

  it("allows cancellation of a proposal and blocks further progress", () => {
    const payload = buildPayload(recipient, 0);

    const proposal = simnet.callPublicFn(
      "dao-core-v1",
      "propose",
      [payload],
      proposer
    );
    expect(proposal.result).toBeOk(proposalId);

    const cancelled = simnet.callPublicFn(
      "dao-core-v1",
      "cancel",
      [proposalId],
      recipient
    );
    expect(cancelled.result).toBeOk(Cl.bool(true));

    const state = cvToValue(
      simnet.getMapEntry("dao-core-v1", "proposals", Cl.tuple({ id: proposalId }))
    ) as any;
    expect(state.value.cancelled.value).toBe(true);

    const queueAttempt = simnet.callPublicFn(
      "dao-core-v1",
      "queue",
      [proposalId],
      proposer
    );
    expect(queueAttempt.result).toBeErr(Cl.uint(110)); // ERR_ALREADY_CANCELLED
  });
});
