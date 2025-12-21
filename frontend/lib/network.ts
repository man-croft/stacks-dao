import { StacksMainnet, StacksMocknet, StacksTestnet } from "@stacks/network";

const env = (process.env.NEXT_PUBLIC_STACKS_NETWORK || "mainnet").toLowerCase();

const registry = {
	mainnet: {
		network: new StacksMainnet(),
		label: "mainnet",
	},
	testnet: {
		network: new StacksTestnet(),
		label: "testnet",
	},
	devnet: {
		network: new StacksMocknet(),
		label: "devnet",
	},
} as const;

const fallback = registry.mainnet;
const selected = registry[env as keyof typeof registry] || fallback;

export const network = selected.network;
export const networkName = selected.label;
