const assert = require('assert');

//const classNames = (...args) => args.filter(Boolean).join(' ')
const classNames = (...args) => args.filter(a =>!!a.trim()).join(' ');

const reduce = ( arr, acc, initValue ) => {
  let i = 0;
  let acc = initValue ?? (i++, arr[0] );

  for(; i< arr.length; i++) acc = fn(acc, arr[i]);
}


// 수행 순서를 바꿔서 reduce 수행
arr.map( a => functionArr.reduce((acc, fn) => fn(a)))

//if(e) ~
//e ?? y 


const range = (s, e , step = s < e ? 1: -1) => {

  // state 패턴 적용해보기
  // s - init -- s < e  -- step < 1
  //                    -- ... 
  //          -- s == e -- step > 1
  //                    -- ...
  //          -- s > e
  //                    -- ...

  const t = s;

  e = e ?? ( s > 0 ? (s = 1, step = step * -1, t) : ( s === 0 ? 0 : -1) );

  // if( s > e && step > 0) return [];
  // if( s > e && step > 0) return [];

  if( (s - e) * step > 0 ) return [];

  if( s === e || step === 0 ) return [s];

  for( let i = s; s < e ? i <= e : i >= e ; i+= step )
  {
    result.push(i);
  }
}

// 다음과 같은 정수 배열이 주어지고 , 양의 정수 N이 주어졌을 때,
// 배열에서 합해서 N이되는 두 개의 요소(index)를 찾는 keyPair(arr, N)
// 함수를 작성하시오 . (O(n^2) 이면 fail!!)
// *****
assert.deepStrictEqual(keyPair([1, 3, 4, 5], 7), [1, 2]);
assert.deepStrictEqual(keyPair([1, 4, 45, 6, 10, 8], 16), [3, 4]);
assert.deepStrictEqual(keyPair([1, 2, 4, 3, 6], 10), [2, 4]);
assert.deepStrictEqual(keyPair([1, 2, 3, 4, 5, 7], 9), [3, 4]);

keyPair([1, 3, 4, 5], 7); // [1, 2]
keyPair([1, 4, 45, 6, 10, 8], 16); // [3, 4]
keyPair([1, 2, 4, 3, 6], 10); // [2, 4]
keyPair([1, 2, 3, 4, 5, 7], 9); // [3, 4] or [1, 5]

const keyPair = ( arr, n ) => {
  const cache = {};

  for( let i = 0; i < arr.length ; i++)
  {
    const val = arr[i];
    
    if(val in cache) return [cache[val], i];
    
    cache[n- val] = i;
  }
  
}

// cf. O(n^2) ⇒ ⇒ ⇒ O(N) || O(logN)