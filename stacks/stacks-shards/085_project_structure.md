# Project Structure

Understand the complete structure and configuration of a Clarinet project.

A Clarinet project follows a carefully designed structure that separates contracts, tests, and configuration. Understanding this structure helps you organize code effectively and configure tools for an efficient development workflow.

## Core project layout

Every Clarinet project contains these essential directories and files:

```
- my-project/
  - .vscode/
  - contracts/
    - main.clar
    - trait.clar
  - deployments/
  - settings/
    - Devnet.toml
    - Mainnet.toml
    - Testnet.toml
  - tests/
    - main.test.ts
  - .gitignore
  - Clarinet.toml
  - package.json
  - tsconfig.json
  - vitest.config.js
```

Each component serves a specific purpose in your development workflow. The sections below explain how they work together to create a complete development environment.

## The project manifest

### Clarinet.toml

The **Clarinet.toml** file is the heart of your project. It defines project metadata and tracks all contracts:

```toml
[project]
name = "counter"
description = "A counter smart contract"

[contracts.traits]
path = "contracts/traits.clar"
clarity_version = 4
epoch = "latest"

[contracts.counter]
path = "contracts/counter.clar"
clarity_version = 4
epoch = "latest"
```

The manifest handles several critical functions:

* **Contract registration**: Every contract must be listed here
* **Stacks epoch and Clarity version**: Specifies Clarity version and epoch for each contract
* **Boot sequence**: Lists contracts to deploy on `clarinet devnet start`

### Epoch configuration

You can specify the epoch in two ways:

```toml
