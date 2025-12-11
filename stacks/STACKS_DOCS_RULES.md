# Stacks Documentation Navigation Rules for AI Agents

This file tells you how to efficiently navigate the `stacks/` folder to find Stacks blockchain documentation.

---

## Directory Structure

```
stacks/
├── stacks_essentials/    # START HERE - 75 curated files for developers
├── stacks-shards/        # FALLBACK - 456 complete topic files  
├── stacks-llm.txt        # LAST RESORT - Full 35k line document
└── all_shards_list.txt   # Index of all shard filenames
```

---

## Navigation Protocol

### Step 1: Always Start with `stacks_essentials/`

This folder contains the most relevant documentation for building on Stacks:

| Topic | Files |
|-------|-------|
| **Transactions & Post Conditions** | `028_*` - `031_*` |
| **Developer Guide** | `071_*` - `110_*` (Quickstart, Tokens, Clarity, Testing, Frontend) |
| **Stacks.js SDK** | `114_*` - `133_*` (Accounts, Transactions, Wallet, Signing) |
| **Full-Stack Tutorial** | `417_*` - `427_*` (Project setup to deployment) |

**Key files by topic:**

- **Clarity contracts**: `031_clarity.md`, `073_clarity_crash_course.md`, `089_contract_interaction.md`
- **Tokens (FT/NFT/SFT)**: `074_create_a_token.md`, `075_fungible_tokens.md`, `076_non_fungible_tokens.md`, `077_semi_fungible_tokens.md`
- **Testing**: `108_unit_testing.md`, `109_integration_testing.md`, `425_testing_clarity_contracts.md`
- **Frontend**: `078_build_a_frontend.md`, `129_connect_wallet.md`, `426_frontend_with_stacksjs.md`
- **Transactions**: `081_sending_transactions.md`, `121_build_transactions.md`, `130_broadcast_transactions.md`

### Step 2: If Not Found, Search `stacks-shards/`

The complete shards folder has 456 files covering ALL Stacks topics including:

- sBTC (`034_*` - `061_*`)
- Dual Stacking (`062_*` - `069_*`)
- Running nodes/miners/signers (`149_*` - `330_*`)
- Bitcoin fundamentals (`400_*` - `416_*`)
- Clarity reference (functions, keywords, types) (`381_*` - `397_*`)

**Search efficiently:**
```bash
# Find files by keyword in filename
ls stacks/stacks-shards/ | grep -i "keyword"

# Example: find sBTC files
ls stacks/stacks-shards/ | grep -i "sbtc"
```

### Step 3: Reference `all_shards_list.txt` for Discovery

This file lists all 456 shard filenames. Scan it to discover available topics before reading files.

### Step 4: Only Use `stacks-llm.txt` for Full-Text Search

The monolithic file is 35,000 lines. Only use it when:
- You need to search across ALL documentation
- You need content not split into individual shards
- Grep for specific terms rather than reading the whole file

---

## Token-Efficient Reading Strategy

1. **Read filenames first** - Use `ls` or `all_shards_list.txt` to identify target files
2. **Read only relevant files** - Don't read entire directories
3. **Use line ranges** - If a file is large, read specific line ranges
4. **One topic at a time** - Don't load multiple files unless comparing
5. **Cache mentally** - Remember what you've read to avoid re-reading

---

## Quick Reference: What's Where

| Need Info About | First Look | Then Try |
|-----------------|------------|----------|
| Clarity syntax/functions | `stacks_essentials/031_*`, `073_*` | `stacks-shards/381_*` - `383_*` |
| Creating tokens | `stacks_essentials/074_*` - `077_*` | - |
| Frontend/Stacks.js | `stacks_essentials/078_*`, `114_*` - `133_*` | - |
| Testing contracts | `stacks_essentials/108_*`, `109_*` | `stacks-shards/425_*` |
| sBTC | `stacks-shards/034_*` - `061_*` | - |
| PoX/Stacking | `stacks-shards/027_*`, `323_*` - `331_*` | - |
| Bitcoin basics | `stacks-shards/400_*` - `416_*` | - |
| Node/Signer setup | `stacks-shards/149_*` - `330_*` | - |
| SIPs/Proposals | `stacks-shards/019_*`, `020_*` | - |

---

## File Naming Convention

Files are numbered sequentially: `NNN_topic_name.md`

- Numbers indicate order in original documentation
- Names are sanitized (lowercase, underscores)
- Use number ranges to read related sections in order
