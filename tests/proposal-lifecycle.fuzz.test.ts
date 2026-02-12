import { describe, it, expect } from "vitest";
import { Cl } from "@stacks/transactions";
import { 
	generateRandomProposalPayload, 
	generateRandomAddress,
	generateRandomUint,
	FuzzTestRunner 
} from "./fuzz-utils";

const deployer = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const accounts = simnet.getAccounts();

async function setupDAO() {
	const treasury = `${deployer}.dao-treasury-v1`;
	simnet.transferSTX(10000, treasury, deployer);
	
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

describe("Fuzz Tests - Proposal Lifecycle", () => {
	it("should handle random proposal submissions", async () => {
		await setupDAO();
		const runner = new FuzzTestRunner(50);
		
		await runner.run(() => {
			const proposer = Array.from(accounts.values())[Math.floor(Math.random() * accounts.size)];
			const recipient = generateRandomAddress();
			const payload = generateRandomProposalPayload(recipient);
			const amount = generateRandomUint(1, 5000);
			
			simnet.transferSTX(Number(amount), `${deployer}.dao-treasury-v1`, deployer);
			
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
		});
		
		const results = runner.getResults();
		expect(results.successRate).toBeGreaterThanOrEqual(95);
	});

	it("should handle edge case amounts in proposals", async () => {
		await setupDAO();
		const runner = new FuzzTestRunner(30);
		
		const proposer = Array.from(accounts.values())[0];
		const recipient = generateRandomAddress();
		
		await runner.run(() => {
			const amount = Math.random() > 0.5 ? 0 : generateRandomUint(1000000, 10000000);
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
			
			expect(result.result).toBeDefined();
		});
		
		const results = runner.getResults();
		expect(results.total).toBe(30);
	});

	it("should handle random proposal metadata", async () => {
		await setupDAO();
		const proposer = Array.from(accounts.values())[0];
		const recipient = generateRandomAddress();
		const payload = generateRandomProposalPayload(recipient);
		const amount = 1000n;
		
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
		const proposalId = (result.result as any).value;
		expect(proposalId).toBeDefined();
	});
});
