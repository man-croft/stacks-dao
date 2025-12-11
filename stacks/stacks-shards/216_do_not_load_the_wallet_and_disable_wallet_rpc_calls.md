# Do not load the wallet and disable wallet RPC calls
disablewallet=1
```

{% endstep %}

{% step %}

#### Systemd unit file

ref: <https://github.com/bitcoin/bitcoin/blob/master/contrib/init/bitcoind.service>

```
[Unit]
Description=Bitcoin daemon
Documentation=https://github.com/bitcoin/bitcoin/blob/master/doc/init.md

