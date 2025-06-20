// ������ ���� push, pop, shift, unshift �� ���� �Լ��� �ۼ��Ͻÿ� .
// (��, �Է°��� ���� ���÷� ������)
const assert = require('assert');

const arr = [1, 2, 3, 4];

function push(array, ...args) {
  return array.concat(args);
}

function pop(array, n = 1){
  if(n===1) return array[array.length - 1];

  return array.slice(-n);
}

function unshift(array, ...args){
  return [...array.slice(n), ...array.slice()]
}

function shift(array, ...args){
  return [...array.slice(args[0]), ...array.slice(args[n])]
}

assert.deepStrictEqual(push(arr, 5, 6), [1, 2, 3, 4, 5, 6]);
assert.deepStrictEqual(pop(arr), 4);
assert.deepStrictEqual(pop(arr, 2), [3, 4]); // 2�� ��!

return;

assert.deepStrictEqual(unshift(arr, 0), [0, 1, 2, 3, 4]);
assert.deepStrictEqual(unshift(arr, 7, 8), [7, 8, 1, 2, 3, 4]);

assert.deepStrictEqual(unshift(arr, 7, 8, 10, 11, 14,15), [7, 8, 1, 2, 3, 4]);

assert.deepStrictEqual(shift(arr), [[1], [2, 3, 4]]); // [shift�Ǵ� ���ҵ�, ���� ���ҵ�]
assert.deepStrictEqual(shift(arr, 2), [[1, 2], [3, 4]]); // 2�� shift

assert.deepStrictEqual(arr, [1, 2, 3, 4]);

function makeArray(n) {
  if (n === 1) return [1];
  return [...makeArray(n - 1), n];
}

function makeReverseArray(n) {
  if (n === 1) return [1];
  return [n, ...makeReverseArray(n - 1)];
}

function makeArrayTCO(n, arr = []) {
  if (n === 1) return [1, ...arr];
  return makeArrayTCO(n - 1, [n, ...arr]);
}