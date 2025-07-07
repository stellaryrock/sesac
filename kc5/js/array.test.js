import {push, pop, shift, unshift} from './array';

const arr = [1,2,3,4];

describe('array', () => {
  test('push', () => {
    expect(push(arr, 5, 6)).toStrictEqual([1,2,3,4,5,6]);
  })

  test('pop', () => {
    expect(pop(arr)).toBe(4);
    expect(pop(arr,2)).toStrictEqual([3,4]);
  })

  test('shift', () => {
    expect(shift(arr)).toStrictEqual([[1],[2,3,4]]);
    expect(shift(arr, 2), [[1,2], [3,4]]);
  })

  test('unshift', () => {
    expect(unshift(arr, 0)).toStrictEqual([0,1,2,3,4]);
    expect(unshift(arr, 7, 8)).toStrictEqual([7,8,1,2,3,4]);
  })
})