# Network Basics

<figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2Fgit-blob-38bbfbae841ffaa0d8ed353ebfc33f0b6fcac882%2Fimage.png?alt=media" alt=""><figcaption><p>image source: <a href="https://www.hiro.so/blog/understanding-nakamotos-fast-blocks-on-stacks">Hiro blog</a></p></figcaption></figure>

### Tokens

Stacks (STX) tokens are the native tokens on the Stacks blockchain. The smallest fraction is one micro-STX. 1,000,000 micro-STX make one Stacks (STX).

STX amounts should be stored as integers (8 bytes long), and represent the amount of micro-STX.

### Fees

Fees are used to incentivize miners to confirm transactions on the Stacks blockchain. The fee is calculated based on the estimate fee rate and the size of the raw transaction in bytes. The fee rate is a market determined variable. For the testnet, it is set to 1 micro-STX.

Fee estimates can obtained through the [`GET /v2/fees/transfer`](https://docs.hiro.so/api#operation/get_fee_transfer) endpoint of the API.

{% hint style="info" %}
Note that this example uses an external tool, [Hiro's Stacks API](https://www.hiro.so/stacks-api). You can also use the native [Stacks API ](https://app.gitbook.com/u/ZrQItu6D9bMKmf1HfsLTnGc05WZ2)if you would rather run your own node or connect to one.
{% endhint %}

{% code title="terminal" %}

```bash
