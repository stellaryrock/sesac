import { describe, expect, test } from "vitest";
import { reduce } from "./reduce";

const arr = [1,2,3,4];

describe("reduce.ts", () => {
  test("reduce", () => {
    expect(reduce<number>(arr, (acc, a) => acc + a)).toStrictEqual(arr.reduce((acc,a) => acc + a));
    expect(reduce<number>(arr, (acc, a) => acc + a, 5)).toStrictEqual(arr.reduce((acc,a) => acc + a, 5));
  });
});
