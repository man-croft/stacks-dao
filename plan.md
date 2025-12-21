# DAO Project Delivery Plan

Structured, sequential checklist to turn this repo into a fully functional DAO with an interactive frontend. Mark progress by changing `- [ ]` to `- [x]` when done. Each step lists goal, concrete actions, and outputs.

## Phase 0 — Repo Triage (today)
- [ ] Confirm toolchain works  
  - Run `npm test` and `clarinet check` to ensure current contracts/tests pass.  
  - Output: Baseline test/check results captured in notes.
- [ ] Capture current contract addresses per network  
  - Check `deployments/*.yaml` and `settings/*` for addresses; note any missing mainnet/testnet plans.  
  - Output: Short inventory of contracts and addresses (simnet/devnet/testnet/mainnet) in `docs/state.md` (file scaffolded, fill when checked).

## Phase 1 — Governance Design Decisions
- [x] Choose voting power source  
  - Options: (a) governance FT (SIP-010) balances, (b) staked/locked balances, (c) 1p1v (current).  
  - Decide on delegation support and snapshot timing (block height at proposal start).  
  - Output: Decision note in `docs/governance-design.md` with parameters (quorum %, threshold %, voting period, timelock, delegation yes/no).
- [x] Define action surface  
  - Decide allowed actions: STX transfer, FT transfer, optional adapter registry for future actions.  
  - Output: Allowed payload schema and adapter list in `docs/governance-design.md`.

## Phase 2 — Contract Hardening & Features
- [ ] Implement real voting power  
  - Wire snapshot of chosen token/balance at proposal creation; adjust `proposal-threshold`, `quorum-needed`, and vote weights.  
  - Add delegation if chosen.  
  - Output: Updated `contracts/dao-core.clar`, migration notes.
- [ ] Expand adapters/treasury  
  - Implement FT branch in `transfer-adapter.clar` and `dao-treasury.clar` to satisfy `treasury-trait`.  
  - Optionally add adapter registry or per-proposal adapter selection.  
  - Output: Updated adapter/treasury contracts.
- [ ] Strengthen integrity checks  
  - Return real `adapter-hash`; store payload hash at proposal; verify at execute; guard cancel permissions (proposer or threshold).  
  - Emit prints/events for propose/vote/queue/execute/cancel.  
  - Output: Updated `dao-core.clar`, documented error codes/events.
- [ ] Parameter review  
  - Revisit quorum/threshold/voting-period/timelock based on design; expose constants centrally.  
  - Output: Parameter table in `docs/governance-design.md`.

## Phase 3 — Tests & Quality Gates
- [ ] Unit tests coverage expansion (Vitest + Clarinet)  
  - Add success-path execution (STX + FT), hash-mismatch rejection, early/late vote, double vote, quorum edge, cancel permission, adapter failure surfacing.  
  - Output: Passing `tests/*.test.ts` with coverage report.
- [ ] Contract lints/checks  
  - Run `clarinet check` and ensure no warnings; add CI step.  
  - Output: CI config updated.
- [ ] Fuzz/simulation (optional)  
  - Add scenario tests for many voters/proposals; random ordering.  
  - Output: Additional simulation test file if pursued.

## Phase 4 — Deployment Pipelines
- [ ] Scripted deployments  
  - Create/update `deployments/*.yaml` for devnet/testnet/mainnet; include ordering and versioning.  
  - Add `scripts/deploy-[net].sh` to publish via Clarinet/Stacks provider.  
  - Output: Reusable deployment scripts and documented addresses in `docs/state.md`.
- [ ] Upgrade playbook  
  - Document adapter hash validation, how to rotate adapters, and how to migrate DAO core if needed.  
  - Output: `docs/upgrade-playbook.md`.

## Phase 5 — Frontend Scaffold
- [ ] Create app shell  
  - Choose stack (Next.js + Vite bundling or CRA alternative); set up TypeScript, ESLint/Prettier, UI kit (minimal, custom tokens).  
  - Output: `frontend/` app with base layout, theme tokens, fonts (e.g., Sora + Space Grotesk), and gradient/pattern background.
- [ ] Wallet & network plumbing  
  - Integrate `@stacks/connect` for Leather auth; env-driven contract addresses; Hiro API client for read-only; simnet/devnet toggle.  
  - Output: Auth context/provider, network selector component.
- [ ] Data layer  
  - Services to read proposals, tallies, status (derived state: Voting, Queued, Ready, Executed, Cancelled); block countdowns.  
  - Output: `frontend/src/lib/daoClient.ts` (or similar) with typed calls.
- [ ] Core screens  
  - Proposal list with status pills and staggered reveal animation.  
  - Proposal detail: metadata, payload, tallies, timeline, call-to-actions gated by state (vote/queue/execute/cancel).  
  - Create proposal flow: kind selector (STX/FT), amount, recipient, memo; validation.  
  - Output: Pages/components implemented and linked.
- [ ] UX polish  
  - Toasts with explorer links, transaction states; mobile-first responsive cards; accessible forms.  
  - Output: Interaction polish and basic analytics hooks (optional).

## Phase 6 — Integration & E2E
- [ ] Simnet/devnet wiring  
  - Connect frontend to local Clarinet devnet; ensure calls work end-to-end.  
  - Output: Verified flows (propose, vote, queue, execute) recorded in a short runbook.
- [ ] E2E tests  
  - Add Playwright/Cypress happy-path covering proposal lifecycle; mock wallet where needed.  
  - Output: Passing E2E suite gated in CI (optional if time-constrained).

## Phase 7 — Ops & Launch
- [ ] CI/CD  
  - GitHub Actions (or similar) running: lint, unit tests, clarinet check, frontend build, optional e2e.  
  - Output: `.github/workflows/ci.yml`.
- [ ] Monitoring & observability  
  - Add Sentry (frontend) and basic logging around failed contract calls; uptime checks for API.  
  - Output: Sentry/env wiring and docs.
- [ ] Documentation  
  - Update README with architecture, setup, devnet workflow, deploy steps, and frontend usage.  
  - Output: `README.md` refreshed; links to `docs/*`.

## Phase 8 — Backlog (Post-MVP)
- [ ] Advanced features  
  - Delegated voting UI, proposal templates, treasury analytics, role-based guards for proposal types, NFT actions, multisig-style execution fallback.  
  - Output: Prioritized backlog list in `docs/backlog.md`.
