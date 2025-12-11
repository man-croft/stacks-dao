# Signer Configuration

{% hint style="info" %}
Note that in this version, the Stacks node will not boot if it sees config values that are unused. If your node is not booting, be sure to check your logs for any messages indicating
{% endhint %}

## Signer Configuration

#### Signer Configuration File Options

The signer configuration file is a TOML file that contains the configuration options for your signer. Below are the options you can set in the signer configuration file.

| Name                         | Required | Description                                                                                                                                                                                                                                                                                   |
| ---------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| node\_host                   | ✓        | IP:PORT where your Stacks node can be accessed. The port 20443 is the default RPC endpoint for Stacks nodes. Note that you must use an IP address - DNS hosts are not supported at this time.                                                                                                 |
| endpoint                     | ✓        | IP:PORT where the signer will expose an RPC endpoint for receiving events from your Stacks node.                                                                                                                                                                                              |
| stacks\_private\_key         | ✓        | Hex representation of the signer's Stacks private key used for communicating with the Stacks Node, including writing to the Stacker DB instance.                                                                                                                                              |
| network                      | ✓        | Network to use. One of "mainnet", "testnet" or "mocknet".                                                                                                                                                                                                                                     |
| auth\_password               | ✓        | Authorization token for HTTP requests made from the signer to your Stacks node.                                                                                                                                                                                                               |
| db\_path                     | ✓        | Path to the signer's database file                                                                                                                                                                                                                                                            |
| block\_proposal\_timeout\_ms |          | Specifies the maximum time (in milliseconds) a signer waits after a Bitcoin block for a miner to produce their first Nakamoto block. If the miner exceeds this time, the signer marks their tenure as invalid and rejects subsequent block proposals. Default value of 600\_000 (10 minutes). |
| metrics\_endpoint            |          | IP:PORT for Prometheus metrics collection.                                                                                                                                                                                                                                                    |
| chain\_id                    |          | An optional ChainID, only used for custom networks (like Nakamoto Testnet)                                                                                                                                                                                                                    |

#### Example Configs

Below are sample configuration files for running a Stacks node and signer provided in one place for convenience. You'll need to modify some of these according to the [How to Run a Signer](https://docs.stacks.co/reference/node-operations/broken-reference) doc.

#### Testnet Signer

```toml
