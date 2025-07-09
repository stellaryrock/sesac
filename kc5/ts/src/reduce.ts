/*
Array.reduce 함수를 고차 함수로 직접 구현하시오.
*/

export const reduce = <T>(
  arr: T[],
  fn: (acc: T | undefined, cur: T) => T,
  initValue: T | undefined = undefined,
): T => {
  if (arr.length === 1) return arr[0];

  return !!initValue
    ? reduce([initValue, ...arr], fn)
    : fn(arr.pop(), reduce(arr, fn));
};
