# Upgrade Playbook

Guidelines for evolving the DAO once deployed. Keep proposals transparent and reversible when possible.

## Safety checks before any change
- Verify current adapter hashes recorded on-chain match the source you plan to ship.
- Capture pre-upgrade state in `docs/state.md` (addresses + hashes).
- Announce the maintenance window and expected blast radius.

## Common flows
- **Rotate adapter:** deploy new adapter, compute hash, open proposal that swaps to the new adapter principal + hash, and verify after execution.
- **Parameter tuning:** propose updated quorum/threshold/timelock constants; include reasoning in proposal memo and update docs.
- **Treasury token additions:** extend registry and adapters, then stage a proposal to whitelist the new token.

## Rollback
- Keep a rollback proposal ready (old adapter hash or previous parameters).
- If an execution fails, capture the error in logs and include in a postmortem note.

## Post-upgrade checklist
- Update `docs/state.md` with new addresses and hashes.
- Tag the release and link the executed proposal transaction.
- Verify frontend points to the new adapters or parameters; redeploy if needed.
- Share change summary in release notes and governance forum.
