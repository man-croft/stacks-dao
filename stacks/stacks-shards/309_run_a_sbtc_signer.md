# Run a sBTC Signer

{% hint style="info" %}
This documentation provides guidelines, best-practices and recommendations for running an sBTC Signer. Review it and adapt it to your infrastructure policy before deploying it.
{% endhint %}

{% hint style="warning" %}
Each sBTC signer will control a set of signing shares used to sign transactions on both Bitcoin and Stacks.

Such shares will be encrypted by using the `private_key` specified in the Signer's config and stored in the PostgreSQL database attached to each signer.

It is of the utmost importance to follow the recommendations below.
{% endhint %}

{% stepper %}
{% step %}

#### Prevent unauthorized access to signer infrastructure

Prevent unauthorized access to the sBTC Signer infrastructure (the signer itself, its private key, and the associated PostgreSQL database).
{% endstep %}

{% step %}

#### Keep an offline, secure backup of the Signer private key

Keep an offline, secure backup of the sBTC Signer private key.
{% endstep %}

{% step %}

#### Regularly backup PostgreSQL database

Regularly backup the PostgreSQL database and store it in a secure location.
{% endstep %}
{% endstepper %}

See [here](https://docs.stacks.co/operate/run-a-sbtc-signer/best-practices-for-running-an-sbtc-signer) for additional best practices to run an sBTC signer.

## Minimum System Requirements

Below are the **minimum required specs** to be able to run a sBTC signer.

* 2 CPU
* 4GB memory
* 50GB storage

Note that these are in *addition* to the hardware requirements for running a Stacks node and Bitcoin node outlined in the [How to Run a Signer doc](https://docs.stacks.co/operate/run-a-signer).

## Connection diagram

<figure><img src="https://github.com/stacks-network/docs/blob/master/docs/operate/.gitbook/assets/image%20(8).png" alt=""><figcaption></figcaption></figure>

## Configure your Bitcoin node

### Minimum version

You will need `bitcoind` version 25 or higher.

### Settings

Your Bitcoin node must include these settings for sBTC signer operation:

* `txindex=1`: Transaction indexing must be enabled
* `server=1`: RPC server must be enabled

### RPC-Based Block Detection

Starting with sBTC v1.1.0, the signer uses RPC polling instead of ZeroMQ for block detection.

The signer connects to Bitcoin Core via RPC and polls for new bitcoin blocks. This process works as follows:

{% stepper %}
{% step %}

#### Bitcoin Core validates a new block

Bitcoin Core validates a new block.
{% endstep %}

{% step %}

#### Signer detects the block via RPC polling

Signer detects the block via RPC polling.
{% endstep %}

{% step %}

#### Signer processes relevant sBTC transactions

Signer processes relevant sBTC transactions.
{% endstep %}
{% endstepper %}

### Example

```bash
bitcoind \
  -server \
  -datadir=${BITCOIN_DATA} \
  -rpcbind=0.0.0.0 \
  -rpcuser=${BITCOIN_RPC_USERNAME} \
  -rpcpassword=${BITCOIN_RPC_PASSWORD} \
  -rpcport=${BITCOIN_RPC_PORT} \
  -rpcallowip=0.0.0.0/0 \
  -rpcallowip=::/0 \
  -txindex
```

## Configure your Stacks node

### Minimum version

Please ensure your Stacks version is up-to-date (using the latest release).

### Event observer

You will need to add a *new* event observer that relays information from the sBTC smart contracts to the sBTC signer:

```toml
[[events_observer]]
endpoint = "sbtc-signer:8801"
events_keys = [
    "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-registry::print",
]
```

### Reference configuration

See [here](https://github.com/stacks-network/sbtc/blob/main/docker/mainnet/nodes/stacks/Config.toml.in).

## Configure your sBTC Signer

The signer configuration file (`signer-config.toml`) defines the signer's operation parameters. The configuration sections include:

### Blocklist Client Settings

```toml
[blocklist_client]
endpoint = "http://blocklist-client:3032"
```

### Bitcoin Connection Settings

Defines how the signer connects to Bitcoin Core:

```toml
[bitcoin]
rpc_endpoints = ["http://user:pass@your-bitcoin-node:8332"]

