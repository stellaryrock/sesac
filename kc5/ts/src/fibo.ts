const memoizedFn(fn) => {
  let cache = {};
  
  return (k) => cache[k] ?? (cache[k] = fn(k))
}

const memoizedFibo = memoizedFn(function(n){
  return n <= 1 ? n
                : memoizedFibo(n-2) + memoizedFibo(n-1);
});

const fibo = function(n){
  return (n <= 1) ? n : fibo(n-2) + fibo(n-1);
};
