import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getNetworkAddressKey, networkName } from "./network";

describe("getNetworkAddressKey", () => {
	const originalEnv = process.env;

	beforeEach(() => {
		process.env = { ...originalEnv };
		vi.resetModules();
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	it("should return mainnet for mainnet configuration", () => {
		process.env.NEXT_PUBLIC_STACKS_NETWORK = "mainnet";
		const result = getNetworkAddressKey();
		expect(result).toBe("mainnet");
	});

	it("should return testnet for testnet configuration", () => {
		process.env.NEXT_PUBLIC_STACKS_NETWORK = "testnet";
		const result = getNetworkAddressKey();
		expect(result).toBe("testnet");
	});

	it("should return testnet for devnet configuration", () => {
		process.env.NEXT_PUBLIC_STACKS_NETWORK = "devnet";
		const result = getNetworkAddressKey();
		expect(result).toBe("testnet");
	});

	it("should default to mainnet when network is not set", () => {
		delete process.env.NEXT_PUBLIC_STACKS_NETWORK;
		const result = getNetworkAddressKey();
		expect(result).toBe("mainnet");
	});
});

describe("networkName", () => {
	it("should be defined", () => {
		expect(networkName).toBeDefined();
	});
});
