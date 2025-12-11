# '-t' option makes this a testnet account
stx make_keychain -t > cli_keychain.json
```

{% endcode %}

`make_keychain` creates the following file:

```js
{
  "mnemonic": "aaa bbb ccc ddd ...",
  "keyInfo": {
    "privateKey": "5a3f1f15245bb3fb...",
    "address": "STJRM2AMVF90ER6G3RW1QTF85E3HZH37006D5ER1",
    "btcAddress": "biwSd6KTEvJcyX2R8oyfgj5REuLzczMYC1",
    "wif": "L4HXn7PLmzoNW...",
    "index": 0
  }
}
```

{% hint style="info" %}
Check out the [Stacks CLI reference](https://docs.hiro.so/references/stacks-cli) for more details
{% endhint %}

| Field                | Description                                                                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mnemonic`           | A 24-word seed phrase used to access the account, generated using [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) with 256 bits of entropy |
| `keyInfo.privateKey` | Private key for the account. Required for token transfers and often referred to as `senderKey`                                                                     |
| `keyInfo.address`    | Stacks address for the account                                                                                                                                     |
| `keyInfo.btcAddress` | Corresponding BTC address for the account.                                                                                                                         |
| `keyInfo.wif`        | Private key of the btcAddress in compressed format.                                                                                                                |
| `keyInfo.index`      | Nonce for the account, starting at 0                                                                                                                               |

Note that a new account automatically exists for each new private key. There is no need to manually instantiate an account on the Stacks blockchain.

{% hint style="info" %}
Addresses are created by generating the [RIPEMD-160 hash](https://en.wikipedia.org/wiki/RIPEMD#RIPEMD-160_hashes) of the [SHA256](https://en.bitcoinwiki.org/wiki/SHA-256) of the public key. BTC addresses are encoded with [Base58Check](https://bitcoin.it/wiki/Base58Check_encoding). For Stacks addresses, [c32check](https://github.com/stacks-network/c32check) is used. Deriving an address from a public key can be done without internet access, for instance using the c32check `c32addressDecode` method.
{% endhint %}

Alternatively to the CLI creation, the [Stacks Transactions JS](https://github.com/stx-labs/stacks.js/tree/master/packages/transactions) library can be used:

{% code title="Generate a private key & derive address (transactions library)" %}

```js
import {
  makeRandomPrivKey,
  privateKeyToString,
  getAddressFromPrivateKey,
  TransactionVersion,
  getPublicKey,
} from "@stacks/transactions";

const privateKey = makeRandomPrivKey();

// Get public key from private
const publicKey = getPublicKey(privateKey);

const stacksAddress = getAddressFromPrivateKey(
  privateKeyToString(privateKey),
  TransactionVersion.Testnet // remove for Mainnet addresses
);
```

{% endcode %}

Finally, you can generate new account using a Stacks-enabled wallet like [Leather](https://leather.io/), [Xverse](https://www.xverse.app/), or [Asigna](https://asigna.io/).

### Handling different formats

It's common for new Stacks developers to get tripped up on the different ways when specifying Stacks' principal (aka addresses) in their development.

Here's a breakdown of dealing with principals in 3 different use cases.

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2F9habwlXLqQ25fu6TUVM5%2Fhandling-principal-formats.jpeg?alt=media&#x26;token=08fcc12c-ee57-48e9-9ab5-a18233773fe2" alt=""><figcaption></figcaption></figure></div>

### The Stacks and Bitcoin address connection

What makes Stacks beautifully connected to its L1 settlement layer, Bitcoin, is their many shared aspects. One being how both utilize a similar address generation scheme based on the P2PKH format, which allows for both a Bitcoin & Stacks address to share the same public key hash. If you base58check decode a legacy bitcoin address, you can reveal the public key hash, which can then be used to generate its respective c32check encoded Stacks address.

Programmatically, you could also use a method called `b58ToC32`, from the `c32check` library, which can abstract the conversion for you.

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2FVqWJul0cMmHoNGXiwsg3%2Fbitcoin-stacks-address-connection.jpeg?alt=media&#x26;token=90fe1ed0-29dc-4a1f-a2d4-0a89d57acc23" alt=""><figcaption></figcaption></figure></div>

***

### Additional Resources

* \[[Hiro Blog](https://www.hiro.so/blog/understanding-the-differences-between-bitcoin-address-formats-when-developing-your-app)] Understanding the Differences Between Bitcoin Address Formats When Developing Your App
* \[[Hiro Blog](https://www.hiro.so/blog/how-every-stacks-address-has-a-corresponding-bitcoin-address)] How Every Stacks Address Has a Corresponding Bitcoin Address&#x20;


