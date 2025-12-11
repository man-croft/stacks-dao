# Do not load the wallet and disable wallet RPC calls
disablewallet=1
```

{% endcode %}
{% endstep %}

{% step %}

#### Systemd unit file

Reference: <https://github.com/bitcoin/bitcoin/blob/master/contrib/init/bitcoind.service>

Save the following as your systemd unit (for example `/etc/systemd/system/bitcoin.service`):

{% code title="bitcoind.service" %}

```
[Unit]
Description=Bitcoin daemon
Documentation=https://github.com/bitcoin/bitcoin/blob/master/doc/init.md

