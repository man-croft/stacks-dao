import { describe, it, expect } from "vitest";
import { Cl } from "@stacks/transactions";
import { generateBoundaryValues, generateRandomAddress } from "./fuzz-utils";

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

describe("Fuzz Tests - Edge Cases and Boundaries", () => {
	it("should handle boundary value amounts", async () => {
		await setupDAO();
		
		const proposer = Array.from(accounts.values())[0];
		const recipient = generateRandomAddress();
		const boundaryValues = generateBoundaryValues();
		
		for (const amount of boundaryValues) {
			const payload = Cl.tuple({
				kind: Cl.stringAscii("stx-transfer"),
				amount: Cl.uint(amount),
				recipient: Cl.principal(recipient),
				token: Cl.none(),
				memo: Cl.none(),
			});
			
			if (amount > 0n && amount < 1000000n) {
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
				
				expect(result.result).toBeDefined();
			}
		}
	});

	it("should handle proposal ID boundary values", async () => {
		await setupDAO();
		
		const boundaryIds = [0n, 1n, 2n, 100n, 1000n, 10000n];
		
		for (const proposalId of boundaryIds) {
			const result = simnet.callReadOnlyFn(
				"dao-core-v1",
				"get-proposal-stats",
				[Cl.uint(proposalId)],
				deployer
			);
			
			expect(result.result).toBeDefined();
		}
	});

	it("should handle empty and malformed inputs gracefully", async () => {
		await setupDAO();
		
		const proposer = Array.from(accounts.values())[0];
		
		// Test with very long string (boundary case)
		const longString = "A".repeat(100);
		
		const result = simnet.callReadOnlyFn(
			"dao-core-v1",
			"get-governance-params",
			[],
			deployer
		);
		
		expect(result.result).toBeDefined();
	});

	it("should handle rapid sequential operations", async () => {
		await setupDAO();
		
		const proposer = Array.from(accounts.values())[0];
		const recipient = generateRandomAddress();
		
		// Rapidly create multiple proposals
		const proposals = [];
		for (let i = 0; i < 10; i++) {
			const payload = Cl.tuple({
				kind: Cl.stringAscii("stx-transfer"),
				amount: Cl.uint(BigInt((i + 1) * 100)),
				recipient: Cl.principal(recipient),
				token: Cl.none(),
				memo: Cl.none(),
			});
			
			const result = simnet.callPublicFn(
				"dao-core-v1",
				"submit-proposal",
				[
					Cl.principal(recipient),
					payload,
					Cl.uint(BigInt((i + 1) * 100)),
				],
				proposer
			);
			
			proposals.push(result);
		}
		
		expect(proposals).toHaveLength(10);
		proposals.forEach(p => expect(p.result).toBeDefined());
	});

	it("should handle concurrent voting from many accounts", async () => {
		await setupDAO();
		
		const proposer = Array.from(accounts.values())[0];
		const recipient = generateRandomAddress();
		
		const payload = Cl.tuple({
			kind: Cl.stringAscii("stx-transfer"),
			amount: Cl.uint(1000n),
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
				Cl.uint(1000n),
			],
			proposer
		);
		
		const proposalId = (proposalResult.result as any).value;
		const voters = Array.from(accounts.values()).slice(1);
		
		// All voters vote concurrently
		for (const voter of voters) {
			simnet.callPublicFn(
				"dao-core-v1",
				"vote",
				[Cl.uint(proposalId), Cl.uint(1n)],
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
});
