# Local Blockchain Development

Clarinet ships with a complete local blockchain environment so you can build, test, and debug smart contracts without deploying to a public network.

## Starting your local blockchain

Launch devnet with all required services:

```bash
clarinet devnet start
```

Useful flags:

| Option                           | Description                                       |
| -------------------------------- | ------------------------------------------------- |
| `--manifest-path <path>`         | Use an alternate `Clarinet.toml`                  |
| `--no-dashboard`                 | Stream logs instead of showing the interactive UI |
| `--deployment-plan-path <path>`  | Apply a specific deployment plan                  |
| `--use-on-disk-deployment-plan`  | Use an existing plan without recomputing          |
| `--use-computed-deployment-plan` | Recompute and overwrite the plan                  |
| `--package <path>`               | Load a packaged devnet configuration              |

{% hint style="info" %}
Prerequisites

Devnet requires Docker. If you see “clarinet was unable to create network,” ensure Docker Desktop is running or the Docker daemon is started.
{% endhint %}

By default the dashboard displays service health, recent transactions, block production, contract deployments, and resource usage. Use `--no-dashboard` in CI or when you prefer streaming logs.

## Core services and features

Devnet starts these services for you:

| Service          | Port  | Purpose                                  |
| ---------------- | ----- | ---------------------------------------- |
| Stacks node      | 20443 | Processes transactions and mines blocks  |
| Bitcoin node     | 18443 | Provides block anchoring in regtest mode |
| Stacks API       | 3999  | REST API for blockchain data             |
| Postgres         | 5432  | Indexes blockchain data                  |
| Stacks Explorer  | 8000  | Browse transactions in a web UI          |
| Bitcoin Explorer | 8001  | View the Bitcoin regtest chain           |

Devnet includes pre-funded accounts:

```clarity
::get_assets_maps
;; +-------------------------------------------+-----------------+
;; | Address                                   | STX Balance     |
;; |-------------------------------------------+-----------------|
;; | ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM | 100000000000000 |
;; | ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 | 100000000000000 |
;; | ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG | 100000000000000 |
;; | ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC | 100000000000000 |
;; | ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND  | 100000000000000 |
;; +-------------------------------------------+-----------------+
```

When devnet starts it automatically deploys your project contracts so you can interact immediately.

```
$ clarinet devnet start
Deploying contracts...
Deploying counter.clar        ✓  ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.counter
Deploying token.clar         ✓  ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.token
Deploying marketplace.clar   ✓  ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.marketplace

All contracts deployed successfully
```

## Configuration and customization

Devnet behavior is controlled by configuration files in your project.

### Basic configuration

`settings/Devnet.toml` defines network settings:

```toml
[network]
name = "devnet"

