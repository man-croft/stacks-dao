import { describe, expect, it } from "vitest";
import { Cl, cvToValue } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const proposer = accounts.get("wallet_1")!;
const recipient = accounts.get("wallet_2")!;
const voters = Array.from(accounts.values()).slice(0, 10);

const proposalId = Cl.uint(1);
const forChoice = Cl.uint(1);

const initContracts = () => {
  // Fund the treasury with STX
  const treasury = `${deployer}.dao-treasury-v1`;
  simnet.transferSTX(10000, treasury, deployer);

  // Initialize treasury with core as governor and adapter as invoker
  simnet.callPublicFn(
    "dao-treasury-v1",
    "init",
    [
      Cl.contractPrincipal(deployer, "dao-core-v1"),
      Cl.contractPrincipal(deployer, "transfer-adapter-v1"),
      Cl.bool(true),
    ],
    deployer
  );

  // Set core contract in adapter
  simnet.callPublicFn(
    "transfer-adapter-v1",
    "set-core",
    [Cl.contractPrincipal(deployer, "dao-core-v1")],
    deployer
  );

  // Mint mock tokens to treasury for FT transfer tests
  const mintResult = simnet.callPublicFn(
    "mock-ft-v1",
    "faucet",
    [Cl.uint(1000000), Cl.contractPrincipal(deployer, "dao-treasury-v1")],
    deployer
  );
  expect(mintResult.result).toBeOk(Cl.bool(true));
};

describe("FT Transfer Execution", () => {
  it("successfully proposes, votes, queues, and executes an FT transfer", () => {
    initContracts();

    // Check treasury has tokens
    const treasuryBalance = simnet.callReadOnlyFn(
      "mock-ft-v1",
      "balance-of",
      [Cl.contractPrincipal(deployer, "dao-treasury-v1")],
      deployer
    );
    expect(treasuryBalance.result).toBeOk(Cl.uint(1000000));

    // 1. Create FT transfer proposal
    const ftPayload = Cl.tuple({
      kind: Cl.stringAscii("ft-transfer"),
      amount: Cl.uint(5000),
      recipient: Cl.principal(recipient),
      token: Cl.some(Cl.contractPrincipal(deployer, "mock-ft-v1")),
      memo: Cl.none(),
    });

    const proposal = simnet.callPublicFn(
      "dao-core-v1",
      "propose",
      [Cl.contractPrincipal(deployer, "transfer-adapter-v1"), ftPayload],
      proposer
    );
    expect(proposal.result).toBeOk(proposalId);

    // 2. Vote on the proposal (10 voters for quorum)
    voters.forEach((voter) => {
      const vote = simnet.callPublicFn(
        "dao-core-v1",
        "cast-vote",
        [proposalId, forChoice],
        voter
      );
      expect(vote.result).toBeOk(Cl.bool(true));
    });

    // Verify votes were recorded
    const tally = cvToValue(
      simnet.getMapEntry("dao-core-v1", "proposals", Cl.tuple({ id: proposalId }))
    ) as any;
    expect(BigInt(tally.value["for-votes"].value)).toBe(10n);

    // 3. Mine blocks to end voting period
    simnet.mineEmptyBlocks(2101);

    // 4. Queue the proposal
    const queued = simnet.callPublicFn(
      "dao-core-v1",
      "queue",
      [proposalId],
      proposer
    );
    expect(queued.result).toBeOk(Cl.bool(true));

    // 5. Mine blocks through timelock
    simnet.mineEmptyBlocks(101);

    // 6. Execute the FT transfer
    const execute = simnet.callPublicFn(
      "dao-core-v1",
      "execute",
      [
        proposalId,
        Cl.contractPrincipal(deployer, "transfer-adapter-v1"),
        Cl.contractPrincipal(deployer, "mock-ft-v1"),
      ],
      proposer
    );
    expect(execute.result).toBeOk(Cl.bool(true));

    // 7. Verify the transfer occurred
    const recipientBalance = simnet.callReadOnlyFn(
      "mock-ft-v1",
      "balance-of",
      [Cl.principal(recipient)],
      deployer
    );
    expect(recipientBalance.result).toBeOk(Cl.uint(5000));

    // Verify treasury balance decreased
    const newTreasuryBalance = simnet.callReadOnlyFn(
      "mock-ft-v1",
      "balance-of",
      [Cl.contractPrincipal(deployer, "dao-treasury-v1")],
      deployer
    );
    expect(newTreasuryBalance.result).toBeOk(Cl.uint(995000));

    // Verify proposal is marked as executed
    const finalState = cvToValue(
      simnet.getMapEntry("dao-core-v1", "proposals", Cl.tuple({ id: proposalId }))
    ) as any;
    expect(finalState.value.executed.value).toBe(true);
  });

  it("rejects FT transfer when token trait does not match payload", () => {
    initContracts();

    // Create FT transfer proposal with mock-ft-v1 as the token
    const ftPayload = Cl.tuple({
      kind: Cl.stringAscii("ft-transfer"),
      amount: Cl.uint(1000),
      recipient: Cl.principal(recipient),
      token: Cl.some(Cl.contractPrincipal(deployer, "mock-ft-v1")),
      memo: Cl.none(),
    });

    // Propose
    const proposal = simnet.callPublicFn(
      "dao-core-v1",
      "propose",
      [Cl.contractPrincipal(deployer, "transfer-adapter-v1"), ftPayload],
      proposer
    );
    expect(proposal.result).toBeOk(proposalId);

    // Vote
    voters.forEach((voter) => {
      simnet.callPublicFn("dao-core-v1", "cast-vote", [proposalId, forChoice], voter);
    });

    // Queue
    simnet.mineEmptyBlocks(2101);
    simnet.callPublicFn("dao-core-v1", "queue", [proposalId], proposer);
    simnet.mineEmptyBlocks(101);

    // Try to execute with wrong token (dao-core instead of mock-ft)
    // This should fail because the token trait doesn't match
    const execute = simnet.callPublicFn(
      "dao-core-v1",
      "execute",
      [
        proposalId,
        Cl.contractPrincipal(deployer, "transfer-adapter-v1"),
        Cl.contractPrincipal(deployer, "dao-core-v1"), // Wrong token!
      ],
      proposer
    );
    // ERR_INVALID_KIND (u102) from transfer-adapter when token doesn't match
    expect(execute.result).toBeErr(Cl.uint(102));
  });

  it("rejects FT transfer when token is missing from payload", () => {
    initContracts();

    // Create ft-transfer payload with token set to none (invalid)
    const ftPayload = Cl.tuple({
      kind: Cl.stringAscii("ft-transfer"),
      amount: Cl.uint(1000),
      recipient: Cl.principal(recipient),
      token: Cl.none(), // Missing token!
      memo: Cl.none(),
    });

    // Propose
    const proposal = simnet.callPublicFn(
      "dao-core-v1",
      "propose",
      [Cl.contractPrincipal(deployer, "transfer-adapter-v1"), ftPayload],
      proposer
    );
    expect(proposal.result).toBeOk(proposalId);

    // Vote
    voters.forEach((voter) => {
      simnet.callPublicFn("dao-core-v1", "cast-vote", [proposalId, forChoice], voter);
    });

    // Queue
    simnet.mineEmptyBlocks(2101);
    simnet.callPublicFn("dao-core-v1", "queue", [proposalId], proposer);
    simnet.mineEmptyBlocks(101);

    // Execute should fail - ERR_TOKEN_EXPECTED (u103)
    const execute = simnet.callPublicFn(
      "dao-core-v1",
      "execute",
      [
        proposalId,
        Cl.contractPrincipal(deployer, "transfer-adapter-v1"),
        Cl.contractPrincipal(deployer, "mock-ft-v1"),
      ],
      proposer
    );
    expect(execute.result).toBeErr(Cl.uint(103));
  });
});
