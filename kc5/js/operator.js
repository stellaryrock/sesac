// 연산자의 종류
let n;

n =  1 + 5; // 산술 연산자, 이항 / 단항( ++, -- 등 );
let s = 'a'; // 할당 연산자

s + 'bc'; // 문자열 연결(병합) 연산자 <=> template literal  `${abc}` // 문자열 연결 연산자보다 template literal 활용이 더 효율적임
n > 5 ; // 비교 연산자 cf. typeof/instanceof/isArray
s === 'a'; // 논리 비교 (logical comparison) 연산자 ( cf. !== )
console.log( NaN === NaN ); // true? Nah....c false
console.log( isNaN(NaN) );

!( n===6  || s === 'a' ) // <=> n !== 6 && s !== 'a'

q = ( p = x = 1, y = 2, z = 3 );
2 ** 3;

var arr; 
console.log( "arr: ", arr );
console.log( "arr?.length: " ,arr?.length ); // 0

arr = arr ?? []; arr?.length;
console.log(arr);