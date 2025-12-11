# for mainnet, replace `testnet` with `mainnet`
curl 'https://api.testnet.hiro.so/v2/fees/transfer'
```

{% endcode %}

The API will respond with the fee rate (as integer):

```json
1
```

[The Stacks Transactions JS library](https://github.com/stx-labs/stacks.js/tree/master/packages/transactions) supports fee estimation for:

* token transfers (`estimateTransfer`)
* contract deploys (`estimateContractDeploy`)
* non read-only contract calls (`estimateContractFunctionCall`)

{% hint style="info" %}
For an implementation using a different language than JavaScript, please review [this reference implementation](https://github.com/stx-labs/stacks.js/blob/master/packages/transactions/src/builders.ts#L97).
{% endhint %}

### Nonces

Every account carries a [nonce property](https://en.wikipedia.org/wiki/Cryptographic_nonce) that indicates the number of transactions processed for the given account. Nonces are one-time codes, starting at `0` for new accounts, and incremented by 1 on every transaction.

Nonces are added to all transactions and help identify them in order to ensure transactions are processed in order and to avoid duplicated processing.

{% hint style="info" %}
The consensus mechanism also ensures that transactions aren't "replayed" in two ways. First, nodes query its unspent transaction outputs (UTXOs) in order to satisfy their spending conditions in a new transaction. Second, messages sent between nodes review sequence numbers.
{% endhint %}

When a new token transfer transaction is constructed, the most recent nonce of the account needs to be fetched and set.

{% hint style="info" %}
The API provides an endpoint to [simplify nonce handling](https://docs.hiro.so/get-started/stacks-blockchain-api#nonce-handling).
{% endhint %}

### Querying

Stacks network details can be queried using the [Stacks Blockchain API](https://docs.hiro.so/get-started/stacks-blockchain-api).

#### Health check

The [status checker](https://status.stacks.org/) is a service that provides a user interface to quickly review the health of the Stacks blockchain.

#### Network info

The network information can be obtained using the [`GET /v2/info`](https://docs.hiro.so/api#operation/get_core_api_info) endpoint:

{% code title="curl (testnet)" %}

```bash
