# Introduction

Stacks: The leading Bitcoin L2.

<div data-with-frame="true"><figure><picture><source srcset="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2Fx09gHeYU67yvfXLh7Iis%2Fbitcoin-stacks.png?alt=media&#x26;token=7635e08d-2495-44ed-a93c-68351882fbf3" media="(prefers-color-scheme: dark)"><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2Fam7BqpV0sbUexW7Zpqoh%2Fbitcoin-stacks-dark.png?alt=media&#x26;token=28aa61b3-628a-4519-a574-0b5856762626" alt=""></picture><figcaption></figcaption></figure></div>

{% hint style="info" %}
For the official Stacks whitepaper: <https://stacks-network.github.io/stacks/stacks.pdf>
{% endhint %}

### Stacks: The TL;DR

Stacks activates the Bitcoin economy. Bitcoin is the most adopted, most valuable, and most decentralized cryptocurrency. The Stacks L2 enables fast, cheap BTC and full-featured smart contracts on the L2 without modifying Bitcoin itself. Users and developers can use BTC in their apps and pay gas fees with BTC. All transactions on Stacks L2 are secured by Bitcoin L1 with 100% finality, enabling you to build apps and digital assets that are integrated
&#x20;with Bitcoin security.

The Stacks layer for smart contracts has the following innovations that make it unique:

**S**: Secured by the entire hash power of Bitcoin (Bitcoin finality).\
**T**: Trust-minimized Bitcoin peg mechanism; write to Bitcoin.\
**A**: Atomic BTC swaps and assets owned by BTC addresses.\
**C**: Clarity language for safe, decidable smart contracts.\
**K**: Knowledge of full Bitcoin state; read from Bitcoin.\
**S**: Scalable, fast transactions that settle on Bitcoin.

#### All of this is accomplished by three core components:

{% stepper %}
{% step %}

#### Proof of Transfer

Proof of Transfer (PoX) is the block production mechanism of the Stacks chain. Essentially, it attempts to recreate the block production patterns of PoW programmatically. Stacks miners spend BTC for a chance to mine new Stacks blocks. Under the hood, this block production mechanism anchors Stacks blocks to Bitcoin blocks, making it as hard to reverse a Stacks block as it is to reverse a Bitcoin block. That's a big claim, and we unpack it in further detail in the sections on Nakamoto block production.

[Learn more about PoX](https://docs.stacks.co/learn/stacks-101/proof-of-transfer)
{% endstep %}

{% step %}

#### Clarity

Clarity is the smart contract language that Stacks uses. It has been designed from the ground up to make it easier for developers to write safe, secure smart contracts. Additionally, since it has been purpose-built for Stacks and Bitcoin, there are built-in functions for reading Bitcoin state, which means you can use Bitcoin state to perform actions in Clarity. For example, you could set up a check to make sure a particular Bitcoin transaction has occurred before executing a mint function in Clarity, which just so happens to be what happens with the third component: sBTC.

[Learn more about Clarity](https://docs.stacks.co/learn/clarity)
{% endstep %}

{% step %}

#### sBTC

sBTC is the trust-minimized 2-way Bitcoin peg on the Stacks layer. sBTC is the key to making Bitcoin programmable and bringing full smart contract functionality to Bitcoin via Stacks. sBTC is not a federation, but operates as an open-network, decentralized 2-way peg solution to bring smart contract functionality to Bitcoin with as little counterparty risk as possible.

[Learn more about sBTC](https://docs.stacks.co/learn/sbtc)
{% endstep %}
{% endstepper %}

***

### Why you need to learn the fundamentals of Stacks?

Stacks fundamentals give you the intuition to build apps that are safer, more Bitcoin-aligned, and more future-proof. A developer who learns the basics doesn’t just write Clarity—they build apps that actually *feel like* Bitcoin apps.

1. You'll build apps that actually leverage Bitcoin
2. You'll avoid costly design mistakes
3. You'll write better smart contracts
4. You'll use sBTC and Bitcoin writes correctly

***

### What to learn next?

<table data-card-size="large" data-view="cards"><thead><tr><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><h4>Stacks 101</h4></td><td>Really dive into the nuts and bolts of how Stacks is built on Bitcoin.</td><td><a href="stacks-101">stacks-101</a></td></tr><tr><td><h4>Network Fundamentals</h4></td><td>Learn about accounts, testnets, SIPs, authentication, BNS, and more.</td><td><a href="network-fundamentals">network-fundamentals</a></td></tr><tr><td><h4>Block Production</h4></td><td>How do Stacks blocks get validated and mined?</td><td><a href="block-production">block-production</a></td></tr><tr><td><h4>Transactions</h4></td><td>Learn about the lifecycle of a transaction on Stacks.</td><td><a href="transactions">transactions</a></td></tr><tr><td><h4>Clarity</h4></td><td>Discover the philosophy and design principles of the Clarity smart contract language.</td><td><a href="clarity">clarity</a></td></tr><tr><td><h4>sBTC</h4></td><td>Understand how bitcoin is unwrapped into a productive and programmable asset.</td><td><a href="sbtc">sbtc</a></td></tr><tr><td><h4>Dual Stacking</h4></td><td>A financial innovation on top of the core foundation of Stacking. Earn bitcoin with bitcoin.</td><td><a href="dual-stacking">dual-stacking</a></td></tr></tbody></table>

***

### Additional Resources

* \[[Stacks YT](https://youtu.be/0erpW7IEo6Y?si=Ldu4RlVVnLqOL4eP)] How Stacks Will Grow In 2025 With Stacks Founder Muneeb Ali
* \[[Token2049 Dubai](https://youtu.be/DFTXAOmi0es?si=sMOO6Yfj_TCVdFTF)] Muneeb Ali - Building Bitcoin’s Future: The Role of Stacks L2&#x20;


