import { describe, expect, it } from "vitest";
import { Cl, cvToValue } from "@stacks/transactions";

const accounts = simnet.getAccounts();
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
  it("rejects non stx-transfer payloads", () => {
    const invalid = Cl.tuple({
      kind: Cl.stringAscii("ft-transfer"),
      amount: Cl.uint(0),
      recipient: Cl.principal(recipient),
      token: Cl.none(),
      memo: Cl.none(),
    });

    const proposal = simnet.callPublicFn(
      "dao-core-v1",
      "propose",
      [invalid],
      proposer
    );

    expect(proposal.result).toBeErr(Cl.uint(115)); // ERR_INVALID_PAYLOAD
  });

  it("queues a passing proposal and surfaces execution failures", () => {
    const payload = buildPayload(recipient, 0);

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

    expect(() =>
      simnet.callPublicFn("dao-core-v1", "execute", [proposalId], proposer)
    ).toThrow(/ContractCallExpectName/);

    const finalState = cvToValue(
      simnet.getMapEntry("dao-core-v1", "proposals", Cl.tuple({ id: proposalId }))
    ) as any;
    expect(finalState.value.executed.value).toBe(false);
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
