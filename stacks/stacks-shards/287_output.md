# Output:
INFO [1738695915.769633] [testnet/stacks-node/src/main.rs:278] [main] stacks-node 3.1.0.0.5 (release/3.1.0.0.5:513dbc5, release build, linux [x86_64])
INFO [1729788064.913175] [testnet/stacks-node/src/main.rs:318] [main] Loading config at path /home/admin/stacks-node/node-config.toml
INFO [1729788064.969551] [testnet/stacks-node/src/main.rs:331] [main] Loaded config!
```

**Start the node**

If the outputs of the previous commands are correct, you can proceed and start the node:

```bash
~/stacks-node/stacks-node start --config ~/stacks-node/node-config.toml
```

{% endstep %}

{% step %}

#### Generate your signer signature

In order to stack, you'll need your signer signature. The fields required are further explained in the [Generate a signer key signature](https://docs.stacks.co/guides-and-tutorials/stack-stx/stacking-flow#step-2-generate-a-signer-key-signature) guide.

The command to generate a signature looks like this:

```bash
~/stacks-signer/stacks-signer generate-stacking-signature \
  --method stack-stx \
  --max-amount 1000000000000 \
  --auth-id 195591226970828652622091037492597751808 \
  --period 12 \
  --reward-cycle 100 \
  --pox-address 19tg... \
  --config ~/stacks-signer/signer-config.toml \
  --json
```

The generated JSON can be then copy-pasted directly in the [Leather Earn](https://earn.leather.io/) website mentioned in the next step.
{% endstep %}

{% step %}

#### Start stacking

The simplest route is to solo stack. You can do that by using [Leather Earn](https://earn.leather.io/). Click on the 'Stack Independently' button and follow the instructions there.

If you would like to learn more about solo stacking or running a pool operator, take a look at the [Stack STX](https://docs.stacks.co/guides-and-tutorials/stack-stx) guide.
{% endstep %}

{% step %}

#### Monitoring

If you would like to learn more about monitoring your signer and its corresponding node, you can check the [How to Monitor a Signer](https://docs.stacks.co/guides-and-tutorials/running-a-signer/how-to-monitor-signer) guide.
{% endstep %}
{% endstepper %}


