// function add(num1, num2, precision = 1){  
//   if( num1 === null || isNaN(num1) ) num1 = 0; // NaN 으로 할지, 0 으로 할지 모르겠어요.
//   if( num2 === null || isNaN(num2) ) num2 = 0; // sum 을 염두에 두고 일단 0 으로 처리하겠습니다.

//   num1 = parseFloat(num1);
//   num2 = parseFloat(num2);
 
//   function makeFloat(num){
//     let split = num.toString().split('.');
//     let precision = split[1]?.length;
//     let adjustedNum = num * ( 10 ** precision ); 

//     return {
//       getNum(){
//         return [adjustedNum, precision];
//       },
//       add(other) {
//         [otherNum, otherPrecision] = other.getNum();

//         return (num + otherNum) / ( 10 ** precision );
//       }
//     }
//   }

//   let float1 = makeFloat(num1);
//   let float2 = makeFloat(num2);

//   return float1.add(float2);
// }


// function makeFloat(num){
//   let split = num.toString().split('.');
//   let precision = split[1]?.length;
//   let adjustedNum = num * ( 10 ** precision ); 

//   return {
//     getNum(){
//       return [adjustedNum, precision];
//     },
//     add(other) {
//       [otherNum, otherPrecision] = other.getNum();

//       return (adjustedNum + otherNum) / ( 10 ** precision );
//     }
//   }
// }

// let f1 = makeFloat(1.234);
// let f2 = makeFloat(2.34);

// console.log( f1.add(f2) );

// let makeFloat = (p) => (num) => {
//   let adjusted = num * ( 10 ** p );

//   return {
//     toNumber : () => num,
//     getState : () => [ p, adjusted ],
//     add : (other) => {
//       // TODO : p 가 다를 경우
//       const [ otherNum, otherP ] = other.getState();
//     }
//   }
// };

const prices = [
  10.34232323, 15, 'xxx', 5.67899, null, 20.9, 1.005121, 0, 15, undefined, 0.5
];

let addfunc = (p) => (num1, num2) => {
  if( num1 === null || isNaN(num1) ) num1 = 0;
  if( num2 === null || isNaN(num2) ) num2 = 0;

  return Math.trunc( num1 * (10 ** p) + num2 * (10 ** p) ) / (10 ** p);
}

let add = addfunc(2);

let test = [
  add( 1.234, 234.2, 2 ),  // 235.4;
  add( '123', 1.23, 1 ),   // 124.2;
  add( null, 123.12 ),     // NaN
  add( 'xyz', 1),          // NaN
]

test.forEach(console.log);

let sum = prices.reduce(add);
console.log(sum);


// for( i = 0.1; i <= 1; i = add(i , 0.1) )
// {
//   console.log(i);
// }

//TODO : p 가 다른 두 수의 덧셈