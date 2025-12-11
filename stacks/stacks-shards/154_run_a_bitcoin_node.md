# Run a Bitcoin Node

{% stepper %}
{% step %}

#### Requirements

This guide is written for a Unix based system. It's reasonable to expect some modifications will be required for other operating systems.

When started, the Bitcoin node will take several days to reach chain tip.

* Bitcoin Core >= v25.0
  * <https://github.com/bitcoin/bitcoin>
  * <https://bitcoincore.org/en/download/>
* Host with a minimum of:
  * 2 vCPU (a single dedicated cpu for the bitcoind process)
  * 4GB Memory (during sync, more available memory will improve sync time)
  * 1TB free disk space
* User account: `bitcoin:bitcoin`
* Chainstate directory located at: `/bitcoin/mainnet`
  * `bitcoin` user must have read/write access.
* Config directory located at: `/etc/bitcoin`
  * `bitcoin` user must have at least read access
    {% endstep %}

{% step %}

#### Add bitcoin user and set file ownership

Run the following commands:

{% code title="Create directories and add user" %}

```shell
$ sudo mkdir -p /bitcoin/mainnet
$ sudo mkdir /etc/bitcoin
$ sudo useradd bitcoin -d /bitcoin
$ sudo chown -R bitcoin:bitcoin /bitcoin /etc/bitcoin/
```

{% endcode %}
{% endstep %}

{% step %}

#### Bitcoin config

Below is a sample config used to sync a bitcoin node - feel free to adjust as needed.

{% hint style="info" %}
If using the [systemd unit below](#systemd-unit-file), save this file as `/etc/bitcoin/bitcoin.conf`
{% endhint %}

* `btuser:btcpass` is hardcoded as an rpcauth user/password ([generated using this script](https://github.com/bitcoin/bitcoin/tree/master/share/rpcauth)).
* Only localhost access is allowed (`127.0.0.1`) on the standard mainnet ports.
* `dbcache` is set to the maximum of 16GB.
* Wallet (and wallet rpc calls) are disabled.

{% code title="Sample /etc/bitcoin/bitcoin.conf" %}

```
## [rpc]

