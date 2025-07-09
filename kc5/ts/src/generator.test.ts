import { describe, test, expect } from "vitest";
import { Subway } from "./generator";

describe("Subway", () => {
  test("iterator", () => {
    const routes = new Subway("문래", "신림");
    const route3 = new Subway("문래", "합정");
    const route4 = new Subway("신도림", "을지로입구");

    const itSubway = routes[Symbol.iterator]();

    expect([...routes]).toStrictEqual([
      "문래",
      "대림",
      "구로디지털단지",
      "신대방",
      "신림",
    ]);
    expect(itSubway.next()).toStrictEqual({ value: "문래", done: false });
    expect(itSubway.next()).toStrictEqual({ value: "대림", done: false });
    expect(itSubway.next()).toStrictEqual({
      value: "구로디지털단지",
      done: false,
    });
    expect(itSubway.next()).toStrictEqual({ value: "신대방", done: false });
    expect(itSubway.next()).toStrictEqual({ value: "신림", done: false });
    expect(itSubway.next()).toStrictEqual({ value: undefined, done: true });

    expect([...route3].length).toBe(46);
    expect([...route4].length).toBe(48);
  });
});
