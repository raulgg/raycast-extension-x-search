import { expect, test } from "vitest";
import { resolveQuickSearchQuery } from "@/features/quick-search-query";

test.each([
  ["root search text over the argument", " from:X cats ", "ignored", "from:X cats"],
  ["the argument when root search text is missing", undefined, " from:X cats ", "from:X cats"],
  ["blank root search text over a filled argument", " ", "from:X", ""],
])("quick search uses %s", (_name, fallbackText, argument, expected) => {
  const query = resolveQuickSearchQuery(fallbackText, argument);

  expect(query).toBe(expected);
});
