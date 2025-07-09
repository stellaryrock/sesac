/*
Array.reduce 함수를 고차 함수로 직접 구현하시오.
*/

// @시코 - 시니어 코딩 유튜브 참조 
// https://www.youtube.com/watch?v=IninpD-gIIc , 33:37 ~

export const reduce = <T>(
  arr: T[],
  fn: (acc: T, cur: T) => T,
  initValue: T | undefined = undefined,
): T => {
  let i = 0;
  let _acc = initValue ?? arr[i++];

  for(; i< arr.length ; i++){
    _acc = fn(arr[i], _acc);
  }

  return _acc;
};
