# Output:
Config: 
Stacks node host: 127.0.0.1:20443
Signer endpoint: 127.0.0.1:30000
Stacks address: SP1G... # address from keychain file
Public key: 03a3... # publicKey from keychain file
Network: mainnet # or testnet
Chain ID: 0x1 # or 0x80000000 for testnet
Database path: /home/admin/stacks-signer/data/signer.sqlite
Metrics endpoint: 127.0.0.1:9154
```

**Start the signer**

If the outputs of the previous commands are correct, you can proceed and start the signer:

```bash
~/stacks-signer/stacks-signer run -c ~/stacks-signer/signer-config.toml
```

{% endstep %}

{% step %}

#### Optional: Set up a Bitcoin node (strongly recommended)

In order to optimize signer health and performance, we highly recommend setting up your own Bitcoin node rather than relying on a third-party node.

We have created guides for running both a [full Bitcoin node](https://docs.stacks.co/operate/readme/run-a-bitcoin-node) and a [pruned Bitcoin node](https://docs.stacks.co/operate/readme/run-a-pruned-bitcoin-node) you can follow.
{% endstep %}

{% step %}

#### Set Up Your Stacks Node

**Download the stacks-node binary**

Official binaries are available from the [Stacks Core releases page on Github](https://github.com/stacks-network/stacks-core/releases). Each release includes pre-built binaries. Download the [latest node release ZIP file](https://github.com/stacks-network/stacks-core/releases/latest) for your server’s architecture and decompress it. Inside of that folder is a `stacks-node` binary.

Assuming a `Linux x64 glibc` machine, the commands to download and uncompress the node binary look like this:

```bash
