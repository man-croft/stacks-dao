# Run a Pruned Bitcoin Node

This guide is written for a Unix based system. It's reasonable to expect some modifications will be required for other operating systems.

When started, the pruned Bitcoin node will take roughly \~24 hours to reach chain tip.

{% hint style="warning" %}
While bitcoin is syncing, it's recommended to keep a stacks-blockchain node at chain tip, or [use a stacks chainstate archive](https://docs.hiro.so/stacks/archive/guides/stacks-blockchain).
{% endhint %}

Requirements:

* Bitcoin Core >= v25.0
  * <https://github.com/bitcoin/bitcoin>
  * <https://bitcoincore.org/en/download/>
* Host with a minimum of:
  * 2 vCPU (a single dedicated cpu for the bitcoind process)
  * 4GB Memory (during sync, more available memory will improve sync time)
  * 50GB free disk space (actual usage is closer to 20GB)
* User account: `bitcoin:bitcoin`
* Chainstate directory located at: `/bitcoin/mainnet`
  * `bitcoin` user must have read/write access.
* Config directory located at: `/etc/bitcoin`
  * `bitcoin` user must have at least read access

Caveats

[BIP-0159](https://github.com/bitcoin/bips/blob/master/bip-0159.mediawiki)

In short, this BIP specifies that pruned nodes will advertise the service bit `NODE_NETWORK_LIMITED`, which restricts syncing blocks older than 288 blocks (\~2 days).

What this means is that in practice, a stacks-blockchain node:

* Cannot sync from genesis using a pruned node.
* Must not be offline or otherwise down for longer than \~2 days (or 288 Bitcoin blocks).

{% stepper %}
{% step %}

#### Add bitcoin user and set file ownership

```shell
$ sudo mkdir -p /bitcoin/mainnet
$ sudo mkdir /etc/bitcoin
$ sudo useradd bitcoin -d /bitcoin
$ sudo chown -R bitcoin:bitcoin /bitcoin /etc/bitcoin/
```

{% endstep %}

{% step %}

#### Bitcoin Config

Below is a sample config used to sync a pruned bitcoin node - feel free to adjust as needed.

{% hint style="info" %}
If using the [systemd unit below](#systemd-unit-file), save this file as `/etc/bitcoin/bitcoin.conf`
{% endhint %}

Notes:

* `btuser:btcpass` is hardcoded as an rpcauth user/password ([generated using this script](https://github.com/bitcoin/bitcoin/tree/master/share/rpcauth)).
* Only localhost access is allowed (`127.0.0.1`) on the standard mainnet ports.
* Pruning is set to be small, storing only the last 1GB of blocks (for p2p traffic, this is more than enough).
* `dbcache` is set to the maximum of 16GB.
* Wallet (and wallet rpc calls) are disabled.

```
## [rpc]

