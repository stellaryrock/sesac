// ?��보나�? ?��?�� 구하�?

// 1. Loop �? ?��?�� 구현
function fiboLoop(n){
  let [prev, next] = [0 , 1];

  for(let i = 0; i < n-1 ; i++){
    [prev, next] = [next, prev+next];
  }

  return prev;
}

console.log('1. Loop �? ?��?�� 구현');
for( let i = 1; i< 10; i++)
  console.log(fiboLoop(i));
console.log('--------------------------------------------');

// 2. ?��?�� ?���?�? ?��?�� 구현
function fiboRecursive(n){
  if(n <= 2) return n-1;
  
  return fiboRecursive(n-2) + fiboRecursive(n-1);
}

console.log('2. ?��?�� ?���?�? ?��?�� 구현');
for( let i = 1; i< 10; i++)
  console.log(fiboLoop(i));
console.log('--------------------------------------------');

// 3. memoization ?�� ?��?��?��?�� 구현
const memoizedFn = (fn) => {
  let table = {};

  return (n) => table[n] || (table[n] = fn(n));
}

console.log('3. memoization ?�� ?��?��?��?�� 구현');
for( let i = 1; i< 10; i++)
  console.log(memoizedFn(fiboRecursive)(i));
console.log('--------------------------------------------');
