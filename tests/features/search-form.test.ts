import { expect, test } from "vitest";
import { isFromDateAfterToDate, restoreForm, validateWholeNumber } from "@/features/search-form";
import { writeSearchQuery } from "@/features/search-query";

test.each([
  ["empty input", "", undefined],
  ["missing input", undefined, undefined],
  ["whole digits", "280", undefined],
  ["a decimal", "2.5", "Use a whole number"],
  ["a whole number written with a decimal zero", "10.0", "Use a whole number"],
  ["letters", "abc", "Use a whole number"],
  ["digits mixed with letters", "10abc", "Use a whole number"],
])("validates count %s", (_name, input, expected) => {
  const error = validateWholeNumber(input);

  expect(error).toBe(expected);
});

test("merges draft values over an empty form", () => {
  const empty = restoreForm();
  const restored = restoreForm({ exactPhrase: "happy hour", replies: "only" });

  const emptyQuery = writeSearchQuery(empty);
  const restoredQuery = writeSearchQuery(restored);

  expect(emptyQuery).toBe("");
  expect(restoredQuery).toBe('"happy hour" filter:replies');
});

test("restores a YYYY-MM-DD draft as that local calendar day", () => {
  const restored = restoreForm({ fromDate: "2026-01-02", toDate: "2026-02-01" });

  const query = writeSearchQuery(restored);

  expect(restored.fromDate).toEqual(new Date(2026, 0, 2));
  expect(restored.toDate).toEqual(new Date(2026, 1, 1));
  expect(query).toBe("until:2026-02-02 since:2026-01-02");
});

test.each([
  ["an impossible day", "2026-02-31"],
  ["a timestamp", "2026-01-02T00:00:00.000Z"],
  ["an invalid date", new Date(Number.NaN)],
])("drops a draft From date that is %s", (_name, fromDate) => {
  const restored = restoreForm({ fromDate });

  const query = writeSearchQuery(restored);

  expect(restored.fromDate).toBeNull();
  expect(query).toBe("");
});

test.each([
  ["a later from date", new Date(2026, 1, 2), new Date(2026, 0, 2), true],
  ["the same day", new Date(2026, 0, 2), new Date(2026, 0, 2), false],
  ["the same day at a later time", new Date(2026, 0, 2, 20, 0), new Date(2026, 0, 2), false],
  ["a missing to date", new Date(2026, 0, 2), null, false],
])("from after to is %s", (_name, fromDate, toDate, after) => {
  const invalid = isFromDateAfterToDate(fromDate, toDate);

  expect(invalid).toBe(after);
});

test("submitted empty From and To are no dates and write no date parts", () => {
  const submitted = { ...restoreForm({ allWords: "cats" }), fromDate: undefined, toDate: undefined };

  const invalid = isFromDateAfterToDate(submitted.fromDate, submitted.toDate);
  const query = writeSearchQuery(submitted);

  expect(invalid).toBe(false);
  expect(query).toBe("cats");
});

test("restores an unknown replies draft as include", () => {
  const restored = restoreForm({ replies: "sometimes" });

  const query = writeSearchQuery(restored);

  expect(restored.replies).toBe("include");
  expect(query).toBe("");
});

test("restores only text draft values and drops fields the form does not have", () => {
  const draft = { allWords: 280, exactPhrase: "happy hour", fromDate: 0, retiredField: "cats" };

  const restored = restoreForm(draft);
  const query = writeSearchQuery(restored);

  expect(restored).not.toHaveProperty("retiredField");
  expect(restored.allWords).toBe("");
  expect(restored.fromDate).toBeNull();
  expect(query).toBe('"happy hour"');
});
