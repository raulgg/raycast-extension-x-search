# Testing

The tests are Vitest unit tests for `extension/src/features/`. They live in `tests/features/` and import modules through the `@/` alias. The tests are the contract for the search query and the search link: each test name states one rule.

## Rules

1. One test is one workflow: setup, action, and the assertions that prove it, separated by blank lines. Prefer fewer, longer tests.
2. Write expected values as literals. Never compute them with the code under test, and never compare an exported constant to itself.
3. Assert what an extension user observes, such as the search query or the search link. Do not assert instructional copy (placeholders, info text, toast prose, section labels) or anything TypeScript already enforces.
4. Each test builds its own state. `vitest.config.ts` resets mocks and stubbed globals after every test.
5. Tests stay offline and in process: no x.com, browser, or Raycast window.
6. Production code has no test-only code: no `_resetForTests` exports, no `NODE_ENV` or `VITEST` branches, and no parameters that only tests pass.
7. Do not add a test for a bug that cannot happen again.

Any `console.error` or `console.warn` you have not declared fails the test. Declare each one with the helpers in `tests/console.ts`.

The suite runs in a time zone west of UTC (`vitest.config.ts`), so a calendar day that goes through UTC fails.

## Manual checks

No automated test covers the native Raycast form, drafts, the action panel, preferences, or opening x.com. When a change touches one of them, run `npm run dev`, try each path the change affects, and list what you checked in the pull request.

## Running

```sh
npm test
npx --no-install vitest run tests/features/search-query.test.ts
npm run quality-check
```

Run `npm run quality-check` before you finish. It runs the same checks as the Quality workflow.
