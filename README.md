# Stacks DAO

A minimal DAO prototype for the Stacks ecosystem. It pairs Clarinet smart contracts with a small Next.js frontend so contributors can propose transfers and connect their wallets.

## What's inside
- `contracts/`: Clarity contracts for the DAO core, treasury, and adapters
- `tests/`: Vitest + clarinet test harness for contract logic
- `frontend/`: Next.js app scaffolded for wallet connection and basic UI
- `deployments/`: YAML plans for simnet/mainnet deployments
- `docs/`: Design notes and backlog planning
- `settings/`: Clarinet environment configs

## Project status
This repo is an MVP scaffold. Governance design decisions live in `docs/governance-design.md`, and most Phase 0/1 work is planned in `plan.md` before hardening contracts and UI.

## Getting started
- Install dependencies for contracts/tests: `npm install`
- Sanity check contracts: `clarinet check`
- Run unit tests: `npm test`
- Frontend: `cd frontend && npm install && npm run dev`
- Configuration: tweak `settings/Devnet.toml` or `frontend/.env` when wiring network endpoints.
