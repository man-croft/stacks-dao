# Accounts

<figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2Fgit-blob-2d782448481ac5b6f078b0307da62a30af1d8d6f%2FFrame%20316126255.jpg?alt=media" alt=""><figcaption></figcaption></figure>

### Introduction

Stacks uses an accounts-based model, more similar to Ethereum, rather than a [UTXO](https://learnmeabitcoin.com/technical/transaction/utxo/) model like Bitcoin. In a UTXO model, the network operates as a ledger, with each UTXO being analagous to a cash bill.

With an accounts-based model, each account is associated with a balance and that balance can be added to or subtracted from.

Stacks accounts are entities that own assets, like Stacks (STX) tokens. An account has an address, private key, nonce, and one or more asset balances.

{% hint style="info" %}
The cryptographic signature algorithm used in Stacks is [**secp256k1**](https://en.bitcoinwiki.org/wiki/Secp256k1).

Additionally, [Ed25519](https://ed25519.cr.yp.to/) is also used just for the VRF (Verifiable Random Function).
{% endhint %}

Assets cannot leave an account without an action from the account owner. All changes to assets (and the balances of the account) require a corresponding transaction.

{% hint style="info" %}
The transaction type doesn't need to be a token transfer - contract deploy and contract call transactions can change the balances of an account
{% endhint %}

### Creation

An account is generated from a 24-word mnemonic phrase. This is often referred to as the **seed phrase**. The seed phrase provides access to Stacks accounts.

{% hint style="danger" %}
If the seed phrase is lost, access to the associated account cannot be restored. No person or organization can recover a lost seed phrase.
{% endhint %}

The easiest way to generate a new Stacks account is to use the [Stacks CLI](https://github.com/stx-labs/stacks.js/tree/master/packages/cli):

{% code title="Generate a new account (CLI)" %}

```bash
