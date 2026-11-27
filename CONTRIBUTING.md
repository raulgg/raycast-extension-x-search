# Contributing

This page explains where to report bugs, propose ideas, and send code.

X Search lives in two places:

- **The development repository**, [raulgg/raycast-extension-x-search](https://github.com/raulgg/raycast-extension-x-search). This is where development happens.
- **The Store repository**, [raycast/extensions](https://github.com/raycast/extensions), under `extensions/x-search`, once the extension is published. That is what the Raycast Store ships.

A [repository sync](#how-repository-sync-works) keeps the two the same. [ADR 0001](docs/adr/0001-development-and-store-repositories.md) explains why there are two. This guide lives only in the development repository, and each instruction names the repository it applies to.

## Where things go

| I want to...                         | Do this                                                                                                                                                                                                           |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Report a bug                         | Open an issue in the [development repository](https://github.com/raulgg/raycast-extension-x-search/issues)                                                                                                        |
| Propose a feature or discuss an idea | Open an issue in the [development repository](https://github.com/raulgg/raycast-extension-x-search/issues) before writing code                                                                                    |
| Submit code                          | Open a pull request in the [development repository](https://github.com/raulgg/raycast-extension-x-search) or in the [Store repository](https://github.com/raycast/extensions). See [Sending code](#sending-code). |

## Discuss ideas first

Open an issue in the development repository before you build a new feature or change behavior. Small bug fixes don't need one.

Raycast won't merge a significant change to an extension without the author's sign-off. Agreeing on the idea first keeps your pull request from stalling, and it keeps the extension a set of commands that open x.com. A command that lists posts inside Raycast belongs in a different extension.

## Sending code

**In the development repository (recommended).** Fork the development repository, branch from `main`, and run `npm install` and `npm run dev` from the repository root. `npm install` also installs the extension's dependencies. To add a dependency the extension ships, run `npm install --prefix extension <package>`, so it lands in `extension/package-lock.json`. The extension lives in `extension/`. Tests and contributor docs stay at the root. After review and merge, we publish the change to the Store repository.

**Directly in the Store repository.** Please don't contribute directly to the Store repository. We keep quality checks, docs, and architecture decisions current in the development repository, and that's easier when every contribution starts here. If you do need to contribute there, follow Raycast's [Contribute to an Extension](https://developers.raycast.com/basics/contribute-to-an-extension) guide. As code owners, we'll review your pull request there and bring the merged change back with a repository sync.

In the development repository:

- `npm run dev` loads the extension into Raycast and reloads on changes.
- Read [docs/architecture.md](docs/architecture.md) for how the code is organized and [docs/testing.md](docs/testing.md) for how to write tests.
- Update [CHANGELOG.md](extension/CHANGELOG.md) with a `## [Title] - {PR_MERGE_DATE}` entry. Raycast fills in the date on release.
- Update the [Store README](extension/README.md) when what extension users see changes.
- Add a Raycast Store handle to `contributors` in `extension/package.json` when someone other than the author contributes.
- Run `npm run quality-check` from the root before you open the pull request. The Quality workflow runs it too.

Commit messages use a light conventional style (`fix:`, `feat:`, `docs:`, `refactor:`, `test:`, `chore:`) with a short imperative summary.

## How repository sync works

The Store repository can change without a pull request in the development repository, so every repository sync starts with a pull.

**Pull, after a change to `extensions/x-search` merges in the Store repository.** In the development repository:

1. Branch from `main` and run `npm run pull-contributions` from the root. It merges the Store changes into `extension/`.
2. Add the tests and docs the change needs, as for any pull request here.
3. Run `npm run quality-check` and open a pull request that links the Store pull request and credits its author with a `Co-authored-by:` trailer.

**Publish, after changes merge in the development repository.** From the root of the development repository, run `npm run pull-contributions`, then `npm run publish`. Publish pushes `extension/` to a fork of the Store repository and opens or updates the Store pull request. It stops while the Store repository has changes nobody has pulled yet.

## Ground rules

- The extension opens a search link in the browser. It does not call the X API, store X credentials, or list posts.
- Nothing is stored except Raycast form drafts, which a search drops.
- Once they ship, keep command names, entrypoint filenames, argument names, and preference names in `extension/package.json` stable, because extension users bind shortcuts and settings to them.
- Raycast's [Store guidelines](https://developers.raycast.com/basics/prepare-an-extension-for-store) apply to every change.

## Docs

Docs are a stable reference. A feature, fix, or refactor changes code, tests, and `extension/CHANGELOG.md`, not docs. Change a doc only when the architecture or a rule for how we build changes.

- Update `GLOSSARY.md` when a term is added or removed.
- Update `extension/README.md` when what extension users see changes. It is product copy.
- ADRs in `docs/adr/` do not change once approved. A new ADR supersedes an old one and links to it.
