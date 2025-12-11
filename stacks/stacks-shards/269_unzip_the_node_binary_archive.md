# Unzip the node binary archive
unzip linux-glibc-x64.zip
```

**Create the configuration file**

Create the configuration file required to start the node (be sure to replace `<your_token>` with your auth token value):

{% tabs %}
{% tab title="Mainnet" %}
{% hint style="warning" %}
For mainnet, we strongly recommended that you run your own bitcoin node (you can follow guides on how to run a [full Bitcoin node](https://docs.stacks.co/guides-and-tutorials/nodes-and-miners/run-a-bitcoin-node) or a [pruned Bitcoin node](https://docs.stacks.co/guides-and-tutorials/nodes-and-miners/run-a-pruned-bitcoin-node)) in order to ensure you have no connection issues when downloading bitcoin blocks. A hosted bitcoin node may cause your stacks node to fall behind tip and remain unsynced.

If you run your own bitcoin node, you'll have to update `peer_host` and optionally add `rpc_port`, `peer_port`, `username` and `password` fields under the `[burnchain]` section of the node's configuration file.
{% endhint %}

```bash
