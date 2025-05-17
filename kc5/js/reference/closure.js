// Çö¼ö´Ô

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