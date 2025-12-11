# Mainnet Execution Simulation

Mainnet execution simulation (MXS) lets you test your Clarity contracts against real mainnet data without deploying experimental code. You can reproduce historical state, validate complex integrations, and debug edge cases while keeping the speed of local development.

## What you'll learn

* Set up MXS in a Clarinet project
* Write tests that interact with mainnet contracts
* Simulate historical transactions
* Understand MXS limitations

## What is Mainnet execution simulation?

Testing smart contracts in realistic conditions is essential. Simnet offers an isolated environment but lacks the live Stacks mainnet's complexity and history.

MXS fills this gap by enabling unit tests with the Clarinet JS SDK and Vitest to simulate the Stacks mainnet state at a specific block height. This allows you to:

* **Validate contract logic with real data:** Directly test mainnet contracts or data within your tests.
* **(Re)simulate transactions:** Analyze mainnet transactions' results, execution, or costs without deploying or using actual STX.

## Enable MXS in your project

Add the following configuration to your `Clarinet.toml` file:

```toml
[repl.remote_data]

