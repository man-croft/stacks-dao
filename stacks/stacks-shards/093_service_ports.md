# Service ports
stacks_node_rpc_port = 20443
stacks_api_port = 3999
stacks_explorer_port = 8000
bitcoin_node_rpc_port = 18443

[network.devnet]
bitcoin_controller_block_time = 30_000  # 30 seconds

disable_bitcoin_explorer = false
disable_stacks_explorer = false
disable_stacks_api = false
```

### Port configuration

Avoid local conflicts by customizing ports:

```toml
stacks_node_rpc_port = 30443
stacks_api_port = 4999
postgres_port = 6432
stacks_explorer_port = 4020
```

### Mining intervals

Control block production speed:

```toml
bitcoin_controller_block_time = 1_000     # Fast development (1 second)
bitcoin_controller_block_time = 30_000    # Standard testing (30 seconds)
bitcoin_controller_block_time = 120_000   # Realistic timing (2 minutes)
```

### Custom accounts

Add accounts with specific balances:

```toml
[accounts.treasury]
mnemonic = "twice kind fence tip hidden tilt action fragile skin nothing glory cousin"
balance = 10_000_000_000_000

[accounts.alice]
mnemonic = "female adjust gallery certain visit token during great side clown fitness like"
balance = 5_000_000_000_000
```

## Accessing services

Devnet exposes several ways to interact with the blockchain.

### Stacks Explorer

Visit the explorer to browse transactions, blocks, contract state, and account balances:

```
http://localhost:8000
```

### API endpoints

Query blockchain data with the Stacks API:

```bash
curl http://localhost:3999/v2/info
```

Common endpoints:

* `/v2/info` – network information
* `/v2/accounts/{address}` – account details
* `/v2/contracts/source/{address}/{name}` – contract source code
* `/extended/v1/tx/{txid}` – transaction details

### Direct RPC

Submit transactions directly to the Stacks node:

```bash
curl -X POST http://localhost:20443/v2/transactions \
  -H "Content-Type: application/json" \
  -d @transaction.json
```

Useful RPC endpoints:

* `/v2/transactions` – broadcast transactions
* `/v2/contracts/call-read` – read-only contract calls
* `/v2/fees/transfer` – fee estimates for STX transfers

## Advanced configuration

### Performance optimization

For faster development cycles:

{% code title="settings/Devnet.toml" %}

```toml
[network.devnet]
bitcoin_controller_block_time = 1_000

disable_bitcoin_explorer = true
disable_stacks_explorer = true
disable_stacks_api = false
```

{% endcode %}

### Epoch configuration

Test different Stacks versions:

```toml
[epochs]
epoch_2_0 = 0     # Stacks 2.0 from genesis
epoch_2_05 = 0    # Stacks 2.05 from genesis  
epoch_2_1 = 0     # Stacks 2.1 from genesis
epoch_2_2 = 0     # Pox-2 from genesis
epoch_2_3 = 0     # Pox-3 from genesis
epoch_2_4 = 0     # Pox-4 from genesis
epoch_3_0 = 101   # Nakamoto activation at block 101
```

### Custom node/signer images

Clarinet runs Devnet with specific tags for each Docker image. For example, Clarinet v3.10.0 uses the following images:

* stacks node: `blockstack/stacks-blockchain:3.3.0.0.1-alpine`
* stacks signer: `blockstack/stacks-signer:3.3.0.0.1.0-alpine`

We recommend Devnet users let Clarinet handle it and use the default version. This ensures that your Clarinet version can handle and properly configure the images it uses.

In some cases, you may need to use other images. Clarinet lets you do this by configuring it in `settings/Devnet.toml`. For example, if you don't want to run the `alpine` images:

```toml
