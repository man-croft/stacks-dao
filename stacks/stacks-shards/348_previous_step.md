# previous step.
stacks_private_key = "$your_stacks_private_key"
```

#### Stacks Node Testnet Config

{% hint style="warning" %}
Note that the `block_proposal_token` field has changed to `auth_token` in the Stacks node configuration file.
{% endhint %}

This is the configuration you'll need to run a Stacks follower node if you are also running a signer. Be sure to change the commented lines to the appropriate data for your setup. If you are not familiar with the process of setting up a signer, be sure to follow the [How to Run a Signer](https://docs.stacks.co/reference/node-operations/broken-reference) guide.

An overview of all Stacks node configuration options can be found in the [Stacks Node Configuration](https://docs.stacks.co/reference/node-operations/broken-reference) doc.

Additions necessary specifically to run a signer are the `[connection_options]` and `[[events_observer]]` sections and the `stacker = true` line. There are also a few comments detailing other lines that need to change.

```toml
[node]

rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
bootstrap_node = "029266faff4c8e0ca4f934f34996a96af481df94a89b0c9bd515f3536a95682ddc@seed.testnet.hiro.so:30444"
prometheus_bind = "127.0.0.1:9153"
working_dir = "/hirosystems/data"
local_peer_seed = "{{ redacted }}"

