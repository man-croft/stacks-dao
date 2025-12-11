# stacks-dao

stacks-dao is a small project containing Clarity smart contracts and Python tooling for interacting with them.

Languages: Clarity (smart contracts), Python (scripts & tests)

## Requirements

- Python 3.8+ (or later)
- pip
- Clarinet (for running Clarity contract tests) or the Stacks CLI
- Node.js & npm (if using Clarinet that depends on it)

## Repository layout (recommended)

- contracts/       -> Clarity contracts (.clar)
- tests/           -> Clarinet tests or Clarity test files
- scripts/         -> Python scripts to interact with contracts
- python/          -> Python package / client code

## Getting started

1. Install Python dependencies:

   python -m pip install -r requirements.txt

2. Install Clarinet (optional, for contract tests):

   See https://github.com/hirosystems/clarinet for installation instructions. Typically:

   npm install -g @hirosystems/clarinet

3. Run Python tests (if any):

   python -m pytest

4. Run Clarinet tests (if contract tests exist):

   clarinet test

## Development

- Add Clarity contracts under contracts/ with .clar extension.
- Put Python client code or scripts under python/ or scripts/ and include a requirements.txt at the repo root.

## Contribution

Contributions are welcome. Please open issues or pull requests describing the change. Add tests for bug fixes and new features when possible.

## License

Add a LICENSE file to this repository. If you want to use MIT, Apache-2.0, or similar, mention it here.

## Maintainers / Contact

For questions, open an issue or contact the repository owner.
