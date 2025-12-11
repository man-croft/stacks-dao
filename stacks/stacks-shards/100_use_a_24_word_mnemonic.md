# Use a 24-word mnemonic
mnemonic = "twice kind fence tip hidden tilt action fragile skin nothing glory cousin green tomorrow spring wrist shed math olympic multiply hip blue scout claw"
```

Generate a new 24-word mnemonic using a BIP39 generator if needed. The longer phrase improves security for production deployments.

</details>

<details>

<summary><strong>Can I test Bitcoin transaction verification in Clarinet?</strong></summary>

Testing contracts that use `clarity-bitcoin-lib` for Bitcoin transaction verification has limitations in simnet and devnet environments.

Current limitations:

* No real Bitcoin blocks or transactions in simnet
* Mock blocks do not contain verifiable Bitcoin transactions
* `get-burn-block-info?` returns mock data unsuitable for verification

Workarounds:

* Test Bitcoin verification logic on mainnet or with mainnet execution simulation
* Write unit tests that mock expected behavior instead of full verification
* Consider separating Bitcoin verification logic so it can be tested independently

The Clarinet team continues to investigate better support for Bitcoin-focused testing.

</details>

<details>

<summary><strong>Why does my devnet freeze at the epoch 3.0 transition?</strong></summary>

The epoch 3.0 transition in devnet can be unstable, with success rates between 50–80% depending on your setup.

Temporary workarounds:

* Restart devnet if it freezes around blocks 139–140
* Try Clarinet 2.14.0, which some users report as more stable
* Watch for the upcoming feature to start devnet directly in epoch 3.0

You can also monitor the transition manually:

```
