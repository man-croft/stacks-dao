# '-t' option makes this a testnet account
stx make_keychain -t | jq > ~/stacks-signer/keychain.json
```

{% endtab %}
{% endtabs %}

The account file previously created looks like this:

```json
{
  "mnemonic": "aaa bbb ccc ddd ...",
  "keyInfo": {
    "privateKey": "65f3...",
    "publicKey": "03a3...",
    "address": "SP1G...",
    "btcAddress": "19tg...",
    "wif": "Kzdt...",
    "index": 0
  }
}
```

From this file, you'll need the `privateKey` value.
{% endstep %}

{% step %}

#### Set Up Your Stacks Signer

**Download the stacks-signer binary**

Official binaries are available from the [Stacks Core releases page on Github](https://github.com/stacks-network/stacks-core/releases). Each release includes pre-built binaries. Download the [latest signer release ZIP file](https://github.com/stacks-network/stacks-core/releases/latest) for your server’s architecture and decompress it. Inside of that folder is a `stacks-signer` binary.

Assuming a `Linux x64 glibc` machine, the commands to download and uncompress the signer binary look like this:

```bash
