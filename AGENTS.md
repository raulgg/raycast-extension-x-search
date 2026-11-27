# Agent instructions

## Glossary

[GLOSSARY.md](GLOSSARY.md) defines the project's terms. Use them in replies, code, comments, copy extension users see, docs, commits, and pull requests. Do not use the words a term lists under _Avoid_.

- When the user uses a word that conflicts with the glossary, say so and ask which meaning they intend.
- When a word is vague or has more than one meaning, propose a precise term.
- When the user describes how something works, check that the code agrees, and raise any contradiction.
- Keywords in `extension/package.json` are words people type to find the extension or a command, not copy they read. They may include words the glossary avoids, such as `tweet`.
- When a term is agreed, update `GLOSSARY.md`. An entry has a short definition and the words to avoid. Keep implementation details out.

## Docs

Read the matching doc before you change that area:

- [CONTRIBUTING.md](CONTRIBUTING.md): where a change belongs, the ground rules, and how a repository sync works between the development repository and the Store repository.
- [docs/architecture.md](docs/architecture.md): how the code is organized.
- [docs/testing.md](docs/testing.md): how to write tests, and the manual checks in Raycast.
- [extension/README.md](extension/README.md): what extension users read in the Store.

Docs change only when the architecture or a rule changes. See [CONTRIBUTING.md](CONTRIBUTING.md#docs). If a routine change seems to need a doc edit, the doc is too specific: make it more general instead of adding detail.

Docs explain what the code and config cannot. Do not restate in prose a rule that ESLint, TypeScript, or Vitest already enforces. Link to the config instead.

Run every script from the repository root, and run `npm run quality-check` before you finish.
