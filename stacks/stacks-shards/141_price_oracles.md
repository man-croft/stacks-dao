# Price Oracles

Leverage real-time market price data in your Clarity smart contract

<figure><img src="https://284917788-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FZz9BLmTU9oydDpL3qiUh%2Fuploads%2Fgit-blob-850b421678f3e430f2a8d10bf8a6c3e53f2e61b1%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

Smart contracts written in **Clarity** run in a deterministic sandbox: they can read data in the Stacks and Bitcoin chainstate, but *nothing else*. Whenever your dApp needs the latest **BTC/USD**, **STX/BTC**, or any other market price, you’ll rely on an **oracle** to bring that data on‑chain in a verifiable way.

This page explains why price‑feed oracles matter on Stacks and links to the specific oracle provider docs with instructions on how to integrate them.

***

## Why you need a price‑feed oracle

For DeFi smart contracts, it’s crucial to leverage trusted sources for asset pricing, which has profound implications for investor returns and trading strategies.&#x20;

Here are some possible scenarios where you might need an oracle.

| On‑chain need                        | Typical Stacks use case                        | What the oracle supplies            |
| ------------------------------------ | ---------------------------------------------- | ----------------------------------- |
| **Liquidations & collateral ratios** | Lending / borrowing protocols, margin trading  | Signed price updated every N blocks |
| **Stablecoin peg maintenance**       | BTC‑backed or exogenous‑collateral stablecoins | Reference BTC/USD (or other) price  |
| **AMM curve calculations**           | DEXs that tune fees or rebalance pools         | Time‑weighted average price (TWAP)  |
| **Derivatives settlement**           | Options, futures, or perpetual swaps           | Final settlement price at expiry    |

{% hint style="info" %}
Rule of thumb: if your contract’s math depends on a real‑time market price, you need a price‑feed oracle.
{% endhint %}

## Oracle Providers for Stacks

Here are the currently available oracle providers that Stacks builders commonly use for price data.

### **Pyth**

Pyth is a pull-based oracle. Stacks Labs currently maintains the Pyth bridge.

[Learn how to use Pyth.](https://docs.stacks.co/build/more-guides/price-oracles/pyth)

### **DIA**

DIA is another oracle provider used by Stacks builders. See DIA's [guide](https://nexus.diadata.org/how-to-guides/fetch-price-data/chain-specific-guide/stacks) for how to use DIA oracles with Stacks. Check out the video tutorial to learn more on how DIA works for Clarity smart contracts:

{% embed url="<https://youtu.be/bhWQxHGpv2s?si=dWlBAEAuYtoQj2sC>" %}


