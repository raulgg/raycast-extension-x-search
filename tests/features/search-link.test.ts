import { expect, test } from "vitest";
import { buildSearchLink, parsePreferredTab, type ResultsTab } from "@/features/search-link";

test("builds a search link with the search query, the typed source, and the results tab", () => {
  const query = "what's happening";

  const link = buildSearchLink(query, "people");

  expect(link).toBe("https://x.com/search?q=what%27s+happening&src=typed_query&f=user");
});

test.each<{ resultsTab: ResultsTab; linkValue: string }>([
  { resultsTab: "top", linkValue: "top" },
  { resultsTab: "latest", linkValue: "live" },
  { resultsTab: "people", linkValue: "user" },
  { resultsTab: "media", linkValue: "media" },
  { resultsTab: "lists", linkValue: "list" },
])("opens the $resultsTab results tab", ({ resultsTab, linkValue }) => {
  const query = "cats";

  const link = buildSearchLink(query, resultsTab);

  expect(new URL(link ?? "").searchParams.get("f")).toBe(linkValue);
});

test.each([
  { name: "Latest when it is the preferred tab", preference: "latest", linkValue: "live" },
  { name: "Top when it is the preferred tab", preference: "top", linkValue: "top" },
  { name: "Top for a preferred tab saved as Default", preference: "default", linkValue: "top" },
  { name: "Top for a tab the preference does not offer", preference: "people", linkValue: "top" },
  { name: "Top when no preferred tab is set", preference: undefined, linkValue: "top" },
])("opens $name", ({ preference, linkValue }) => {
  const query = "cats";

  const link = buildSearchLink(query, parsePreferredTab(preference));

  expect(new URL(link ?? "").searchParams.get("f")).toBe(linkValue);
});

test("keeps a typed search query with operators, quotes, and symbols intact in the link", () => {
  const query = '"happy hour" from:X (#cats OR @dogs) -filter:replies min_faves:10 & 100%';

  const link = buildSearchLink(query, "top");

  expect(new URL(link ?? "").searchParams.get("q")).toBe(
    '"happy hour" from:X (#cats OR @dogs) -filter:replies min_faves:10 & 100%',
  );
});
