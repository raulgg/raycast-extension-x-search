# Develop in this repository and publish to the Store repository

X Search is developed in this repository, the development repository, and the Store ships the copy of `extension/` in [raycast/extensions](https://github.com/raycast/extensions), the Store repository. We keep tests, contributor docs, and CI here, because the Store repository holds only the shipped extension and runs only Raycast's own checks. The maintainer runs a repository sync with Raycast's `pull-contributions` and `publish` commands.

## Considered options

- **Develop only in the Store repository.** It has a single source and gives every contributor Store credit. It has no place for tests or contributor docs, and its CI does not run our checks.
- **Keep the tests inside `extension/`.** One copy would hold everything, but the tests and their config would ship to the Store with the extension.

## Consequences

- The Store repository changes without us. Contributors can open pull requests there, Raycast reviewers push commits to Store pull requests, Raycast migrates dependencies across all extensions, and a merge fills in each changelog date. The maintainer pulls these changes into the development repository and adds any missing tests.
- Store contributor credit follows the Store pull request author, so a change merged here is credited to the maintainer who publishes it. The `contributors` field in `extension/package.json` credits other authors.
