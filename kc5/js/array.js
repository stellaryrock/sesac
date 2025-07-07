export function push(array, ...args) {
  return array.concat(args);
}

export function pop(array, n = 1){
  if(n===1) return array[array.length - 1];

  return array.slice(-n);
}


export function unshift( arr, ...args ){
  return [...args, ...arr];
}

export function shift( arr, n = 1 ){
  return [arr.slice(0, n), arr.slice(n)];
}

export function makeArray(n) {
  if (n === 1) return [1];
  return [...makeArray(n - 1), n];
}

export function makeReverseArray(n) {
  if (n === 1) return [1];
  return [n, ...makeReverseArray(n - 1)];
}

export function makeArrayTCO(n, arr = []) {
  if (n === 1) return [1, ...arr];
  return makeArrayTCO(n - 1, [n, ...arr]);
}