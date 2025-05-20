// function add(num1, num2, precision = 1){  
//   if( num1 === null || isNaN(num1) ) num1 = 0; // NaN ���� ����, 0 ���� ���� �𸣰ھ��.
//   if( num2 === null || isNaN(num2) ) num2 = 0; // sum �� ���ο� �ΰ� �ϴ� 0 ���� ó���ϰڽ��ϴ�.

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
//       // TODO : p 
//       const [ otherNum, otherP ] = other.getState();
//     }
//   }
// };

// let add = addFloat(2);

// let test = [
//   add( 1.234, 234.2, 2 ),  // 235.4;
//   add( '123', 1.23, 1 ),   // 124.2;
//   add( null, 123.12 ),     // NaN
//   add( 'xyz', 1),          // NaN
// ]

// test.forEach(console.log);

const prices = [
  10.34232323, 15, 'xxx', 5.67899, null, 20.9, 1.005121, 0, 15, undefined, 0.5
];

let addFloat = (p) => (num1, num2) => {
  if( num1 === null || isNaN(num1) ) num1 = 0;
  if( num2 === null || isNaN(num2) ) num2 = 0;

  return Math.trunc( num1 * (10 ** p) + num2 * (10 ** p) ) / (10 ** p);
}

let sum = prices.reduce(addFloat(2));
console.log("🚀 ~ sum:", sum)

const add = addFloat(2);
// for( i = 0.1; i <= 1; i = add(i , 0.1) )
// {
//   console.log(i);
// }

//create, delete , alter , drop, 


// Object.Entries -> 해시 값을 iterate 돌 수 있는 이유 ?
// 복합키 쓰는게 별로 좋지 않은지? 유저의 즐겨찾기 ( userid, productid )
// TODO : p 가 다른 두 수를 더하기
// TODO : let avg = prices.reduce(addFloat(2)).devide(prices.length).toNumber();


// INSERT INTO 할 때 단순히 추가하는게 아니라 이미 있는 값은 UPDATE, 없으면 INSERT
// view, trigger 
// INSERT IGNORE
// INSERT INTO ON DUPLICATE KEY UPDATE
// UML 은 필수 ( 유즈 케이스 ) => 명사를 테이블(CLASS), 동사는 SQL 문(METHOD) 으로