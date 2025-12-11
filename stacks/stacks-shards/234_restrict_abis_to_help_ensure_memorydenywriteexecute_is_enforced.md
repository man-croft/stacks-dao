# Restrict ABIs to help ensure MemoryDenyWriteExecute is enforced
SystemCallArchitectures=native

[Install]
WantedBy=multi-user.target
```

{% endstep %}

{% step %}

#### Enable and start the Bitcoin service

```shell
$ sudo systemctl daemon-reload
$ sudo systemctl enable bitcoin.service
$ sudo systemctl start bitcoin.service
```

{% endstep %}

{% step %}

#### Track sync progress

{% hint style="info" %}
Once started, you may track the sync progress:

```
$ sudo tail -f /bitcoin/mainnet/debug.log
2024-12-05T19:35:31Z UpdateTip: new best=00000000000000000058990a84cc8f8eab25dbbd572f123f9190cea7256d7349 height=509258 version=0x20000000 log2_work=88.128280 tx=299522737 date='2018-02-15T03:42:14Z' progress=0.295203 cache=43.5MiB(172740txo)
...
$ bitcoin-cli \
    -rpcconnect=127.0.0.1 \
    -rpcport=8332 \
    -rpcuser=btcuser \
    -rpcpassword=btcpass \
    getblockcount
509016
```

{% endhint %}
{% endstep %}
{% endstepper %}


