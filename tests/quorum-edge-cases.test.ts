import { describe, expect, it } from "vitest";
import { Cl, cvToValue } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const proposer = accounts.get("wallet_1")!;
const recipient = accounts.get("wallet_2")!;
const allVoters = Array.from(accounts.values());

const forChoice = Cl.uint(1);
const againstChoice = Cl.uint(0);
const abstainChoice = Cl.uint(2);

const initContracts = () => {
  const treasury = `${deployer}.dao-treasury-v1`;
  simnet.transferSTX(10000, treasury, deployer);

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

  simnet.callPublicFn(
    "transfer-adapter-v1",
    "set-core",
    [Cl.contractPrincipal(deployer, "dao-core-v1")],
    deployer
  );
};

const createProposal = () => {
  const payload = Cl.tuple({
    kind: Cl.stringAscii("stx-transfer"),
    amount: Cl.uint(100),
    recipient: Cl.principal(recipient),
    token: Cl.none(),
    memo: Cl.none(),
  });

  return simnet.callPublicFn(
    "dao-core-v1",
    "propose",
    [Cl.contractPrincipal(deployer, "transfer-adapter-v1"), payload],
    proposer
  );
};

describe("Quorum Edge Cases", () => {
  it("fails to queue when quorum is not met (9 votes with 10% quorum = 10 needed)", () => {
    initContracts();
    
    // Get quorum params
    const params = simnet.callReadOnlyFn(
      "dao-core-v1",
      "get-parameters",
      [],
      deployer
    );
    const paramsValue = cvToValue(params.result) as any;
    expect(paramsValue.value["quorum-percent"].value).toBe("10"); // 10%

    const proposal = createProposal();
    const proposalId = Cl.uint(1);
    expect(proposal.result).toBeOk(proposalId);

    // Only 9 voters vote - not enough for 10% quorum (need 10 votes)
    const ninevoters = allVoters.slice(0, 9);
    ninevoters.forEach((voter) => {
      const vote = simnet.callPublicFn(
        "dao-core-v1",
        "cast-vote",
        [proposalId, forChoice],
        voter
      );
      expect(vote.result).toBeOk(Cl.bool(true));
    });

    // Verify votes
    const tally = cvToValue(
      simnet.getMapEntry("dao-core-v1", "proposals", Cl.tuple({ id: proposalId }))
    ) as any;
    expect(BigInt(tally.value["for-votes"].value)).toBe(9n);

    // Check proposal-passes returns false
    simnet.mineEmptyBlocks(2101);
    const passes = simnet.callReadOnlyFn(
      "dao-core-v1",
      "proposal-passes",
      [proposalId],
      deployer
    );
    expect(passes.result).toBeOk(Cl.bool(false));

    // Queue should fail with ERR_NOT_PASSED (u112)
    const queue = simnet.callPublicFn(
      "dao-core-v1",
      "queue",
      [proposalId],
      proposer
    );
    expect(queue.result).toBeErr(Cl.uint(112));
  });

  it("succeeds when exactly at quorum threshold (10 votes)", () => {
    initContracts();

    const proposal = createProposal();
    const proposalId = Cl.uint(1);
    expect(proposal.result).toBeOk(proposalId);

    // Exactly 10 voters for quorum
    const tenVoters = allVoters.slice(0, 10);
    tenVoters.forEach((voter) => {
      simnet.callPublicFn("dao-core-v1", "cast-vote", [proposalId, forChoice], voter);
    });

    simnet.mineEmptyBlocks(2101);

    const passes = simnet.callReadOnlyFn(
      "dao-core-v1",
      "proposal-passes",
      [proposalId],
      deployer
    );
    expect(passes.result).toBeOk(Cl.bool(true));

    const queue = simnet.callPublicFn(
      "dao-core-v1",
      "queue",
      [proposalId],
      proposer
    );
    expect(queue.result).toBeOk(Cl.bool(true));
  });

  it("fails when more against votes than for votes (even with quorum)", () => {
    initContracts();

    const proposal = createProposal();
    const proposalId = Cl.uint(1);
    expect(proposal.result).toBeOk(proposalId);

    // 4 for, 6 against = 10 votes (meets quorum) but fails majority
    allVoters.slice(0, 4).forEach((voter) => {
      simnet.callPublicFn("dao-core-v1", "cast-vote", [proposalId, forChoice], voter);
    });
    allVoters.slice(4, 10).forEach((voter) => {
      simnet.callPublicFn("dao-core-v1", "cast-vote", [proposalId, againstChoice], voter);
    });

    // Verify tally
    const tally = cvToValue(
      simnet.getMapEntry("dao-core-v1", "proposals", Cl.tuple({ id: proposalId }))
    ) as any;
    expect(BigInt(tally.value["for-votes"].value)).toBe(4n);
    expect(BigInt(tally.value["against-votes"].value)).toBe(6n);

    simnet.mineEmptyBlocks(2101);

    // Should fail - more against than for
    const passes = simnet.callReadOnlyFn(
      "dao-core-v1",
      "proposal-passes",
      [proposalId],
      deployer
    );
    expect(passes.result).toBeOk(Cl.bool(false));

    const queue = simnet.callPublicFn(
      "dao-core-v1",
      "queue",
      [proposalId],
      proposer
    );
    expect(queue.result).toBeErr(Cl.uint(112)); // ERR_NOT_PASSED
  });

  it("passes when for equals against plus one (minimal majority)", () => {
    initContracts();

    const proposal = createProposal();
    const proposalId = Cl.uint(1);
    expect(proposal.result).toBeOk(proposalId);

    // 6 for, 5 against, 0 abstain = 11 votes, minimal majority
    allVoters.slice(0, 6).forEach((voter) => {
      simnet.callPublicFn("dao-core-v1", "cast-vote", [proposalId, forChoice], voter);
    });
    allVoters.slice(6, 11).forEach((voter) => {
      simnet.callPublicFn("dao-core-v1", "cast-vote", [proposalId, againstChoice], voter);
    });

    simnet.mineEmptyBlocks(2101);

    const passes = simnet.callReadOnlyFn(
      "dao-core-v1",
      "proposal-passes",
      [proposalId],
      deployer
    );
    expect(passes.result).toBeOk(Cl.bool(true));
  });

  it("fails when for equals against (tie - not a majority)", () => {
    initContracts();

    const proposal = createProposal();
    const proposalId = Cl.uint(1);
    expect(proposal.result).toBeOk(proposalId);

    // 5 for, 5 against = tie
    allVoters.slice(0, 5).forEach((voter) => {
      simnet.callPublicFn("dao-core-v1", "cast-vote", [proposalId, forChoice], voter);
    });
    allVoters.slice(5, 10).forEach((voter) => {
      simnet.callPublicFn("dao-core-v1", "cast-vote", [proposalId, againstChoice], voter);
    });

    simnet.mineEmptyBlocks(2101);

    // Tie should not pass (for > against required, not for >= against)
    const passes = simnet.callReadOnlyFn(
      "dao-core-v1",
      "proposal-passes",
      [proposalId],
      deployer
    );
    expect(passes.result).toBeOk(Cl.bool(false));
  });

  it("counts abstain votes toward quorum but not for/against", () => {
    initContracts();

    const proposal = createProposal();
    const proposalId = Cl.uint(1);
    expect(proposal.result).toBeOk(proposalId);

    // 5 for, 2 against, 3 abstain = 10 total (meets quorum), 5>2 (passes)
    allVoters.slice(0, 5).forEach((voter) => {
      simnet.callPublicFn("dao-core-v1", "cast-vote", [proposalId, forChoice], voter);
    });
    allVoters.slice(5, 7).forEach((voter) => {
      simnet.callPublicFn("dao-core-v1", "cast-vote", [proposalId, againstChoice], voter);
    });
    allVoters.slice(7, 10).forEach((voter) => {
      simnet.callPublicFn("dao-core-v1", "cast-vote", [proposalId, abstainChoice], voter);
    });

    const tally = cvToValue(
      simnet.getMapEntry("dao-core-v1", "proposals", Cl.tuple({ id: proposalId }))
    ) as any;
    expect(BigInt(tally.value["for-votes"].value)).toBe(5n);
    expect(BigInt(tally.value["against-votes"].value)).toBe(2n);
    expect(BigInt(tally.value["abstain-votes"].value)).toBe(3n);

    simnet.mineEmptyBlocks(2101);

    const passes = simnet.callReadOnlyFn(
      "dao-core-v1",
      "proposal-passes",
      [proposalId],
      deployer
    );
    expect(passes.result).toBeOk(Cl.bool(true));
  });

  it("abstain-only votes meet quorum but fail (0 for, 0 against)", () => {
    initContracts();

    const proposal = createProposal();
    const proposalId = Cl.uint(1);
    expect(proposal.result).toBeOk(proposalId);

    // 10 abstain votes - meets quorum but 0 > 0 is false
    allVoters.slice(0, 10).forEach((voter) => {
      simnet.callPublicFn("dao-core-v1", "cast-vote", [proposalId, abstainChoice], voter);
    });

    simnet.mineEmptyBlocks(2101);

    const passes = simnet.callReadOnlyFn(
      "dao-core-v1",
      "proposal-passes",
      [proposalId],
      deployer
    );
    // 0 > 0 is false, so proposal doesn't pass
    expect(passes.result).toBeOk(Cl.bool(false));
  });
});

describe("Voting Constraints", () => {
  it("prevents double voting by the same voter", () => {
    initContracts();

    const proposal = createProposal();
    const proposalId = Cl.uint(1);
    expect(proposal.result).toBeOk(proposalId);

    // First vote
    const firstVote = simnet.callPublicFn(
      "dao-core-v1",
      "cast-vote",
      [proposalId, forChoice],
      proposer
    );
    expect(firstVote.result).toBeOk(Cl.bool(true));

    // Second vote should fail
    const secondVote = simnet.callPublicFn(
      "dao-core-v1",
      "cast-vote",
      [proposalId, forChoice],
      proposer
    );
    expect(secondVote.result).toBeErr(Cl.uint(105)); // ERR_ALREADY_VOTED
  });

  it("prevents voting after voting period ends", () => {
    initContracts();

    const proposal = createProposal();
    const proposalId = Cl.uint(1);
    expect(proposal.result).toBeOk(proposalId);

    // Fast forward past voting period
    simnet.mineEmptyBlocks(2101);

    // Try to vote after period ended
    const lateVote = simnet.callPublicFn(
      "dao-core-v1",
      "cast-vote",
      [proposalId, forChoice],
      proposer
    );
    expect(lateVote.result).toBeErr(Cl.uint(104)); // ERR_VOTING_CLOSED
  });

  it("prevents voting on cancelled proposals", () => {
    initContracts();

    const proposal = createProposal();
    const proposalId = Cl.uint(1);
    expect(proposal.result).toBeOk(proposalId);

    // Cancel the proposal
    simnet.callPublicFn("dao-core-v1", "cancel", [proposalId], proposer);

    // Try to vote on cancelled proposal
    const vote = simnet.callPublicFn(
      "dao-core-v1",
      "cast-vote",
      [proposalId, forChoice],
      recipient
    );
    expect(vote.result).toBeErr(Cl.uint(104)); // ERR_VOTING_CLOSED
  });
});
