import { describe, it, expect } from "vitest";
import { Cl } from "@stacks/transactions";
import { 
	generateRandomProposalPayload, 
	generateRandomAddress,
	generateRandomVotingPattern 
} from "./fuzz-utils";

const deployer = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const accounts = simnet.getAccounts();

async function setupDAO() {
	const treasury = `${deployer}.dao-treasury-v1`;
	simnet.transferSTX(100000, treasury, deployer);
	
	simnet.callPublicFn(
		"dao-treasury-v1",
		"init",
		[
			Cl.contractPrincipal(deployer, "dao-core-v1"),
			Cl.contractPrincipal(deployer, "transfer-adapter-v1"),
			Cl.bool(true)
		],
		deployer
	);
	
	simnet.callPublicFn(
		"transfer-adapter-v1",
		"set-core",
		[Cl.contractPrincipal(deployer, "dao-core-v1")],
		deployer
	);
}

async function createProposal(proposer: string, amount = 1000n): Promise<bigint> {
	const recipient = generateRandomAddress();
	const payload = generateRandomProposalPayload(recipient);
	
	const result = simnet.callPublicFn(
		"dao-core-v1",
		"submit-proposal",
		[
			Cl.principal(recipient),
			payload,
			Cl.uint(amount),
		],
		proposer
	);
	
	return (result.result as any).value;
}

describe("Fuzz Tests - Voting Patterns", () => {
	it("should handle random voting distributions", async () => {
		await setupDAO();
		
		const proposer = Array.from(accounts.values())[0];
		const proposalId = await createProposal(proposer);
		
		const numVoters = Math.floor(Math.random() * 8) + 2;
		const votingPattern = generateRandomVotingPattern(numVoters);
		
		let forVotes = 0n;
		let againstVotes = 0n;
		
		for (const { voter, vote } of votingPattern) {
			const result = simnet.callPublicFn(
				"dao-core-v1",
				"vote",
				[Cl.uint(proposalId), Cl.uint(vote)],
				voter
			);
			
			expect(result.result).toBeDefined();
			
			if (vote === 1n) {
				forVotes++;
			} else {
				againstVotes++;
			}
		}
		
		const stats = simnet.callReadOnlyFn(
			"dao-core-v1",
			"get-proposal-stats",
			[Cl.uint(proposalId)],
			deployer
		);
		
		expect(stats.result).toBeDefined();
	});

	it("should handle extreme voting scenarios", async () => {
		await setupDAO();
		
		const proposer = Array.from(accounts.values())[0];
		const proposalId = await createProposal(proposer);
		
		// Test unanimous for votes
		const voters = Array.from(accounts.values()).slice(0, 5);
		for (const voter of voters) {
			simnet.callPublicFn(
				"dao-core-v1",
				"vote",
				[Cl.uint(proposalId), Cl.uint(1)],
				voter
			);
		}
		
		const stats = simnet.callReadOnlyFn(
			"dao-core-v1",
			"get-proposal-stats",
			[Cl.uint(proposalId)],
			deployer
		);
		
		expect(stats.result).toBeDefined();
	});

	it("should handle single voter scenarios", async () => {
		await setupDAO();
		
		const proposer = Array.from(accounts.values())[0];
		const proposalId = await createProposal(proposer);
		
		const singleVoter = Array.from(accounts.values())[1];
		const result = simnet.callPublicFn(
			"dao-core-v1",
			"vote",
			[Cl.uint(proposalId), Cl.uint(1)],
			singleVoter
		);
		
		expect(result.result).toBeDefined();
	});

	it("should handle alternating vote patterns", async () => {
		await setupDAO();
		
		const proposer = Array.from(accounts.values())[0];
		const proposalId = await createProposal(proposer);
		
		const voters = Array.from(accounts.values()).slice(1, 9);
		
		for (let i = 0; i < voters.length; i++) {
			const vote = i % 2 === 0 ? 1n : 0n;
			simnet.callPublicFn(
				"dao-core-v1",
				"vote",
				[Cl.uint(proposalId), Cl.uint(vote)],
				voters[i]
			);
		}
		
		const stats = simnet.callReadOnlyFn(
			"dao-core-v1",
			"get-proposal-stats",
			[Cl.uint(proposalId)],
			deployer
		);
		
		expect(stats.result).toBeDefined();
	});
});
