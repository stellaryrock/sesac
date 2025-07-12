import { describe, test, expect } from "vitest";
import { addFloat } from "./addFloat";

describe('addFloat', () => {
  test('add', () => {
    const prices = [10.34, 15, 'xxx', 5.678, null, 20.9, 1.005, 0, 15, undefined, 0.5];
    
    const P = 2;
    const add = addFloat(P);

    expect( add(1.03, 2.15) ).toBeCloseTo( 3.18, 2 );
    expect( prices.reduce(add) ).toBeCloseTo( 68.41, P );
  });
});