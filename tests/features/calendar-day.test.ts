import { expect, test } from "vitest";
import { pickableDateRange } from "@/features/calendar-day";

test("offers days from 2006 through the last day of this year", () => {
  const year = new Date().getFullYear();

  const range = pickableDateRange();

  expect(range.min).toEqual(new Date(2006, 0, 1));
  expect(range.max).toEqual(new Date(year, 11, 31));
});
