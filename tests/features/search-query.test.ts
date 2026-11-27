import { expect, test } from "vitest";
import { type AdvancedSearchValues } from "@/features/search-form";
import { buildSearchLink } from "@/features/search-link";
import { writeSearchQuery } from "@/features/search-query";

function advancedSearchForm(overrides: Partial<AdvancedSearchValues> = {}): AdvancedSearchValues {
  return {
    allWords: "",
    exactPhrase: "",
    anyWords: "",
    noneWords: "",
    hashtags: "",
    language: "",
    fromAccounts: "",
    toAccounts: "",
    mentionedAccounts: "",
    replies: "include",
    links: "include",
    minReplies: "",
    minLikes: "",
    minReposts: "",
    fromDate: null,
    toDate: null,
    ...overrides,
  };
}

test.each<[string, Partial<AdvancedSearchValues>, string]>([
  ["all of these words", { allWords: "what's happening" }, "what's happening"],
  ["an exact phrase", { exactPhrase: "happy hour" }, '"happy hour"'],
  ["either word", { anyWords: "cats dogs" }, "(cats OR dogs)"],
  ["a single any word without parentheses", { anyWords: "cats" }, "cats"],
  ["excluded words", { noneWords: "cats dogs" }, "-cats -dogs"],
  ["one hashtag", { hashtags: "#ThrowbackThursday" }, "#ThrowbackThursday"],
  ["one account", { fromAccounts: "@X" }, "from:X"],
  ["accounts replied to", { toAccounts: "@nasa, @esa" }, "(to:nasa OR to:esa)"],
  ["mentioned accounts", { mentionedAccounts: "@SFBART @Caltrain" }, "(@SFBART OR @Caltrain)"],
  ["a minimum of likes", { minLikes: "280" }, "min_faves:280"],
  ["only replies", { replies: "only" }, "filter:replies"],
  ["excluded replies and only links", { replies: "exclude", links: "only" }, "-filter:replies filter:links"],
])("writes %s", (_name, overrides, expected) => {
  const filled = advancedSearchForm(overrides);

  const query = writeSearchQuery(filled);

  expect(query).toBe(expected);
});

test("leaves replies and links out of the query when they are included", () => {
  const filled = advancedSearchForm({ allWords: "cats", replies: "include", links: "include" });

  const query = writeSearchQuery(filled);

  expect(query).toBe("cats");
});

test("joins two from-accounts and two hashtags with OR", () => {
  const filled = advancedSearchForm({ fromAccounts: "@nasa @esa", hashtags: "#a #b" });

  const query = writeSearchQuery(filled);

  expect(query).toBe("(#a OR #b) (from:nasa OR from:esa)");
});

test("splits mentioned accounts on commas and strips every leading @", () => {
  const filled = advancedSearchForm({ fromAccounts: "@@X", mentionedAccounts: "@SFBART, @Caltrain" });

  const query = writeSearchQuery(filled);

  expect(query).toBe("from:X (@SFBART OR @Caltrain)");
});

test("drops quotes inside an exact phrase before wrapping it", () => {
  const filled = advancedSearchForm({ exactPhrase: 'say "hi"' });

  const query = writeSearchQuery(filled);

  expect(query).toBe('"say hi"');
});

test.each([
  ["strips leading zeros", "0280", "min_faves:280"],
  ["omits a zero count", "0", ""],
  ["omits letters", "abc", ""],
  ["omits a decimal", "2.5", ""],
  ["omits a whole number written with a decimal zero", "10.0", ""],
  ["omits a fraction below one", "0.9", ""],
  ["omits digits mixed with letters", "10abc", ""],
])("%s for minimum likes", (_name, minLikes, expected) => {
  const filled = advancedSearchForm({ minLikes });

  const query = writeSearchQuery(filled);

  expect(query).toBe(expected);
});

test("writes a local calendar day and puts until before since", () => {
  expect(process.env.TZ).toBe("America/Los_Angeles");
  const filled = advancedSearchForm({ fromDate: new Date(2026, 0, 2, 20, 0), toDate: new Date(2026, 1, 1) });

  const query = writeSearchQuery(filled);

  expect(query).toBe("until:2026-02-02 since:2026-01-02");
});

test.each([
  ["the same day in From and To", new Date(2026, 0, 2), new Date(2026, 0, 2), "until:2026-01-03 since:2026-01-02"],
  ["To on 31 December", null, new Date(2026, 11, 31), "until:2027-01-01"],
  ["To on the last day of February", null, new Date(2026, 1, 28), "until:2026-03-01"],
])("keeps posts from the To day for %s", (_name, fromDate, toDate, expected) => {
  const filled = advancedSearchForm({ fromDate, toDate });

  const query = writeSearchQuery(filled);

  expect(query).toBe(expected);
});

test("splits hashtags on commas as accounts are split", () => {
  const filled = advancedSearchForm({ hashtags: "#cats,#dogs, birds" });

  const query = writeSearchQuery(filled);

  expect(query).toBe("(#cats OR #dogs OR #birds)");
});

test("writes one hashtag from a word and collapses extra hash marks", () => {
  const word = advancedSearchForm({ hashtags: "ThrowbackThursday" });
  const repeated = advancedSearchForm({ hashtags: "##ThrowbackThursday" });

  const wordQuery = writeSearchQuery(word);
  const repeatedQuery = writeSearchQuery(repeated);

  expect(wordQuery).toBe("#ThrowbackThursday");
  expect(repeatedQuery).toBe("#ThrowbackThursday");
});

test("drops a typed OR from any of these words before joining them", () => {
  const filled = advancedSearchForm({ anyWords: "cats OR dogs" });

  const query = writeSearchQuery(filled);

  expect(query).toBe("(cats OR dogs)");
});

test("strips leading minuses from an excluded word before adding one", () => {
  const filled = advancedSearchForm({ noneWords: "-cats" });

  const query = writeSearchQuery(filled);

  expect(query).toBe("-cats");
});

test("writes every field in the fixed part order", () => {
  const filled = advancedSearchForm({
    allWords: "cats dogs",
    exactPhrase: "happy hour",
    anyWords: "birds mice",
    noneWords: "spam",
    hashtags: "#t1 #t2",
    fromAccounts: "@nasa",
    toAccounts: "@esa",
    mentionedAccounts: "@hubble",
    minReplies: "1",
    minLikes: "2",
    minReposts: "3",
    language: "en",
    fromDate: new Date(2026, 0, 2),
    toDate: new Date(2026, 1, 1),
    replies: "exclude",
    links: "only",
  });

  const query = writeSearchQuery(filled);

  expect(query).toBe(
    'cats dogs "happy hour" (birds OR mice) -spam (#t1 OR #t2) from:nasa to:esa @hubble min_replies:1 min_faves:2 min_retweets:3 lang:en until:2026-02-02 since:2026-01-02 -filter:replies filter:links',
  );
});

test("parenthesizes OR in all of these words only when another part exists", () => {
  const alone = advancedSearchForm({ allWords: "cats OR dogs" });
  const withPhrase = advancedSearchForm({ allWords: "cats OR dogs", exactPhrase: "happy hour", minLikes: "10" });

  const aloneQuery = writeSearchQuery(alone);
  const combinedQuery = writeSearchQuery(withPhrase);

  expect(aloneQuery).toBe("cats OR dogs");
  expect(combinedQuery).toBe('(cats OR dogs) "happy hour" min_faves:10');
});

test("returns no query and no link for an empty form", () => {
  const empty = advancedSearchForm();

  const query = writeSearchQuery(empty);
  const link = buildSearchLink(query, "top");

  expect(query).toBe("");
  expect(link).toBeNull();
});
