import { Cl } from "@stacks/transactions";
import { uintCV, principalCV, stringAsciiCV, tupleCV, someCV, noneCV } from "@stacks/transactions";

export const deployer = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";

export function generateRandomAddress(): string {
	const chars = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
	let result = "ST";
	for (let i = 0; i < 38; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

export function generateRandomUint(min = 1, max = 1000000): bigint {
	return BigInt(Math.floor(Math.random() * (max - min + 1)) + min);
}

export function generateRandomProposalPayload(recipient?: string) {
	const to = recipient || generateRandomAddress();
	const amount = generateRandomUint(1, 10000);
	
	return Cl.tuple({
		kind: Cl.stringAscii("stx-transfer"),
		amount: Cl.uint(amount),
		recipient: Cl.principal(to),
		token: Cl.none(),
		memo: Cl.none(),
	});
}

export function generateRandomVotingPattern(numVoters: number): Array<{ voter: string; vote: bigint }> {
	const patterns: Array<{ voter: string; vote: bigint }> = [];
	for (let i = 0; i < numVoters; i++) {
		patterns.push({
			voter: generateRandomAddress(),
			vote: Math.random() > 0.5 ? 1n : 0n,
		});
	}
	return patterns;
}

export function generateFuzzedString(maxLength = 100): string {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_- ";
	const length = Math.floor(Math.random() * maxLength);
	let result = "";
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

export function generateBoundaryValues(): bigint[] {
	return [
		0n,
		1n,
		2n,
		10n,
		100n,
		1000n,
		10000n,
		100000n,
		1000000n,
		BigInt(Number.MAX_SAFE_INTEGER),
		BigInt(Number.MAX_SAFE_INTEGER) + 1n,
	];
}

export class FuzzTestRunner {
	private iterations: number;
	private results: Array<{ success: boolean; error?: string }> = [];

	constructor(iterations: number = 100) {
		this.iterations = iterations;
	}

	async run(testFn: () => void | Promise<void>): Promise<void> {
		for (let i = 0; i < this.iterations; i++) {
			try {
				await testFn();
				this.results.push({ success: true });
			} catch (error) {
				this.results.push({ 
					success: false, 
					error: error instanceof Error ? error.message : String(error) 
				});
			}
		}
	}

	getResults() {
		const passed = this.results.filter(r => r.success).length;
		const failed = this.results.filter(r => !r.success).length;
		const failures = this.results.filter(r => !r.success).map(r => r.error);
		
		return {
			total: this.iterations,
			passed,
			failed,
			failures,
			successRate: (passed / this.iterations) * 100,
		};
	}
}
