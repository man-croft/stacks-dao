# Clarinet-sbtc-token.toml

...

[contracts.sbtc-registry]
path = 'contracts/sbtc-registry-double.clar'
clarity_version = 3
epoch = 3.0

...
```

### How It Works

* When testing `sbtc-token`, Rendezvous **first checks** if `Clarinet-sbtc-token.toml` exists.
* If found, it **uses this file** to initialize Simnet.
* If not, it **falls back** to the standard `Clarinet.toml`.

This ensures that the test double is only used when testing `sbtc-token`, keeping tests realistic while allowing necessary state transitions.

## Trait Reference Parameters

Rendezvous automatically generates arguments for function calls. It handles most Clarity types without any setup from you. However, **trait references** require special handling since Rendezvous cannot generate them automatically.

### How Trait Reference Selection Works

When your functions accept trait reference parameters, you must include at least one trait implementation in your Clarinet project. This can be either a project contract or a requirement.

Here's how Rendezvous handles trait references:

1. **Project Scanning** – Before testing begins, Rendezvous scans your project for functions that use trait references.
2. **Implementation Discovery** – It searches the contract AST for matching trait implementations and adds them to a selection pool.
3. **Random Selection** – During test execution, Rendezvous randomly picks an implementation from the pool and uses it as a function argument.

This process allows Rendezvous to create meaningful state transitions and validate your invariants or property-based tests.

### Example

The `example` Clarinet project demonstrates this feature. The [send-tokens](https://github.com/stacks-network/rendezvous/blob/9c02aa7c2571b3795debc657bd433fd9bf7f19eb/example/contracts/send-tokens.clar) contract contains [one public function](https://github.com/stacks-network/rendezvous/blob/9c02aa7c2571b3795debc657bd433fd9bf7f19eb/example/contracts/send-tokens.clar#L3-L7) and [one property-based test](https://github.com/stacks-network/rendezvous/blob/9c02aa7c2571b3795debc657bd433fd9bf7f19eb/example/contracts/send-tokens.tests.clar#L24-L47) that both accept trait references.

To enable testing, the project includes [rendezvous-token](https://github.com/stacks-network/rendezvous/blob/9c02aa7c2571b3795debc657bd433fd9bf7f19eb/example/contracts/rendezvous-token.clar), which implements the required trait.

### Adding More Implementations

You can include multiple eligible trait implementations in your project. Adding more implementations allows Rendezvous to introduce greater randomness during testing and increases behavioral diversity. If a function that accepts a trait implementation parameter is called X times, those calls are distributed across the available implementations. As the number of implementations grows, Rendezvous has more options to choose from on each call, producing a wider range of behaviors — and uncovering edge cases that may be missed when relying on a single implementation.


