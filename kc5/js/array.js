// 다음과 같은 push, pop, shift, unshift 를 순수 함수로 작성하시오 .
// (단, 입력값은 다음 예시로 한정함)
const assert = require('assert');

const arr = [1, 2, 3, 4];

function push(array, ...args) {
  return array.concat(args);
}

function pop(array, n = 1){
  if(n===1) return array[array.length - 1];

  return array.slice(-n);
}


assert.deepStrictEqual(push(arr, 5, 6), [1, 2, 3, 4, 5, 6]);
assert.deepStrictEqual(pop(arr), 4);
assert.deepStrictEqual(pop(arr, 2), [3, 4]); // 2개 팝!

return;
assert.deepStrictEqual(unshift(arr, 0), [0, 1, 2, 3, 4]);
assert.deepStrictEqual(unshift(arr, 7, 8), [7, 8, 1, 2, 3, 4]);

assert.deepStrictEqual(shift(arr), [[1], [2, 3, 4]]); // [shift되는 원소들, 남은 원소들]
assert.deepStrictEqual(shift(arr, 2), [[1, 2], [3, 4]]); // 2개 shift
assert.deepStrictEqual(arr, [1, 2, 3, 4]);