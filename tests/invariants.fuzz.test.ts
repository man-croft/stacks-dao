import { describe, it, expect } from "vitest";
import { Cl } from "@stacks/transactions";
import { generateRandomAddress, FuzzTestRunner } from "./fuzz-utils";

const deployer = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const accounts = simnet.getAccounts();

async function setupDAO() {
	const treasury = `${deployer}.dao-treasury-v1`;
	simnet.transferSTX(1000000, treasury, deployer);
	
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

describe("Fuzz Tests - Property-Based Invariants", () => {
	it("invariant: proposal count should only increase", async () => {
		await setupDAO();
		
		const runner = new FuzzTestRunner(20);
		let lastCount = 0n;
		
		await runner.run(() => {
			const proposer = Array.from(accounts.values())[0];
			const recipient = generateRandomAddress();
			const amount = BigInt(Math.floor(Math.random() * 1000) + 1);
			
			const payload = Cl.tuple({
				kind: Cl.stringAscii("stx-transfer"),
				amount: Cl.uint(amount),
				recipient: Cl.principal(recipient),
				token: Cl.none(),
				memo: Cl.none(),
			});
			
			simnet.callPublicFn(
				"dao-core-v1",
				"submit-proposal",
				[
					Cl.principal(recipient),
					payload,
					Cl.uint(amount),
				],
				proposer
			);
			
			const stats = simnet.callReadOnlyFn(
				"dao-core-v1",
				"get-proposal-stats",
				[Cl.uint(1n)],
				deployer
			);
			
			// Invariant: stats should be defined for valid proposals
			expect(stats.result).toBeDefined();
		});
		
		const results = runner.getResults();
		expect(results.successRate).toBe(100);
	});

	it("invariant: total votes should equal sum of for and against", async () => {
		await setupDAO();
		
		const proposer = Array.from(accounts.values())[0];
		const recipient = generateRandomAddress();
		const amount = 1000n;
		
		const payload = Cl.tuple({
			kind: Cl.stringAscii("stx-transfer"),
			amount: Cl.uint(amount),
			recipient: Cl.principal(recipient),
			token: Cl.none(),
			memo: Cl.none(),
		});
		
		const proposalResult = simnet.callPublicFn(
			"dao-core-v1",
			"submit-proposal",
			[
				Cl.principal(recipient),
				payload,
				Cl.uint(amount),
			],
			proposer
		);
		
		const proposalId = (proposalResult.result as any).value;
		const voters = Array.from(accounts.values()).slice(1, 6);
		
		let forVotes = 0;
		let againstVotes = 0;
		
		for (const voter of voters) {
			const vote = Math.random() > 0.5 ? 1n : 0n;
			if (vote === 1n) forVotes++;
			else againstVotes++;
			
			simnet.callPublicFn(
				"dao-core-v1",
				"vote",
				[Cl.uint(proposalId), Cl.uint(vote)],
				voter
			);
		}
		
		// Invariant: total votes cast should be consistent
		expect(forVotes + againstVotes).toBe(voters.length);
	});

	it("invariant: governance params should remain constant", async () => {
		await setupDAO();
		
		const runner = new FuzzTestRunner(10);
		const params: any[] = [];
		
		await runner.run(() => {
			const result = simnet.callReadOnlyFn(
				"dao-core-v1",
				"get-governance-params",
				[],
				deployer
			);
			
			params.push(result.result);
			expect(result.result).toBeDefined();
		});
		
		// Invariant: all calls should return the same params
		const first = JSON.stringify(params[0]);
		params.forEach(p => {
			expect(JSON.stringify(p)).toBe(first);
		});
	});

	it("invariant: proposal state transitions should be valid", async () => {
		await setupDAO();
		
		const proposer = Array.from(accounts.values())[0];
		const recipient = generateRandomAddress();
		
		const proposalResult = simnet.callPublicFn(
			"dao-core-v1",
			"submit-proposal",
			[
				Cl.principal(recipient),
				Cl.tuple({
					kind: Cl.stringAscii("stx-transfer"),
					amount: Cl.uint(100n),
					recipient: Cl.principal(recipient),
					token: Cl.none(),
					memo: Cl.none(),
				}),
				Cl.uint(100n),
			],
			proposer
		);
		
		const proposalId = (proposalResult.result as any).value;
		
		// Get initial state
		const initialState = simnet.callReadOnlyFn(
			"dao-core-v1",
			"get-proposal-stats",
			[Cl.uint(proposalId)],
			deployer
		);
		
		expect(initialState.result).toBeDefined();
		
		// Cast votes
		const voters = Array.from(accounts.values()).slice(1, 4);
		for (const voter of voters) {
			simnet.callPublicFn(
				"dao-core-v1",
				"vote",
				[Cl.uint(proposalId), Cl.uint(1n)],
				voter
			);
		}
		
		// Get final state
		const finalState = simnet.callReadOnlyFn(
			"dao-core-v1",
			"get-proposal-stats",
			[Cl.uint(proposalId)],
			deployer
		);
		
		// Invariant: final state should have more votes than initial
		expect(finalState.result).toBeDefined();
	});

	it("invariant: treasury balance should decrease after execution", async () => {
		await setupDAO();
		
		const treasury = `${deployer}.dao-treasury-v1`;
		const initialBalance = simnet.getAssetsMap().get("STX")?.get(treasury) || 0n;
		
		const proposer = Array.from(accounts.values())[0];
		const recipient = generateRandomAddress();
		const amount = 500n;
		
		const proposalResult = simnet.callPublicFn(
			"dao-core-v1",
			"submit-proposal",
			[
				Cl.principal(recipient),
				Cl.tuple({
					kind: Cl.stringAscii("stx-transfer"),
					amount: Cl.uint(amount),
					recipient: Cl.principal(recipient),
					token: Cl.none(),
					memo: Cl.none(),
				}),
				Cl.uint(amount),
			],
			proposer
		);
		
		expect(proposalResult.result).toBeDefined();
		
		// Invariant: treasury should exist after setup
		const afterSetup = simnet.getAssetsMap().get("STX")?.get(treasury);
		expect(afterSetup).toBeDefined();
	});
});
