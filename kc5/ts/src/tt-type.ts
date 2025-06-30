//const isStringNumber = (value: unknown): value is [string, number] =>
  //<이 부분을 작성하시오>
  
const f1 = (value: number | string | boolean | [string, number]) => {

    if (isStringNumber(value)) {
      console.log(value[0].toUpperCase(), value[1].toFixed());
    }

};



interface Animal {}
interface Dog extends Animal {
    name: string;
}
interface Cat extends Animal {
    punch(): void;
}

//class Retriever implements Dog {}

// function isDog(a: Animal): a is Dog {
// 	<이 부분을 작성하시오>
// }
const sizeOption = {XS: 1, S: 5, M: 2, L: 2, XL: 4};

const SIZE = [
  {id: 'XS', price: 8000},
  {id: 'S', price: 10000},
  {id: 'M', price: 12000},
  {id: 'L', price: 14000},
  {id: 'XL', price: 15000},
] as const;

const totalPrice = SIZE.reduce(
  (currPrice, size) =>
  currPrice + (sizeOption[size.id] * size.price), 0
);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
고객이 주문한 상품의 총 금액을 요금표를 참고하여 계산하려고 한다. 에러가 발생하는 이유와 해결 방법을 고민해보자.
"아래와 같이 사이즈에 M이 아니라 MM으로 사이즈를 잘 못 기입했을 경우 TS 오류가 나면 통과"
*/
<<<<<<< HEAD

const sizeOption1 = { XS: 1, S: 5, M: 2, L: 2, XL: 4};
const totalPrice1 = SIZE.reduce( ( currPrice, size ) => currPrice + sizeOption1[size.id] * size.price, 0);

const sizeOption2 = { XS: 2, S: 5, MM: 3, L:2 , XL: 4};
const totalPrice2 = SIZE.reduce( (currPrice, size ) => currPrice + sizeOption2[size.id] * size.price, 0);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const isStringNumber = (value: unknown): value is [string, number] =>
//이 부분을 작성하시오

const f1 = (value: number | string | boolean | [string, number]) => {
  if (isStringNumber(value)) {
    console.log(value[0].toUpperCase(), value[1].toFixed());
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 문제1) 다음에서 T1과 동일한 타입으로 T2를 정의하시오.

const cart = {
  X: 1,
  Y: 2,
  Z: 3,
};

type T1 = "X" | "Y" | "Z";
type T2 = keyof typeof cart;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 문제2) 다음에서 T3과 동일한 타입으로 T4를 정의하시오.

const constCart = {
    X: 1,
    Y: 2,
    Z: 3,
  } as const;
  
//type T3 = 1 | 2 | 3;
//type T4 = ??
  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
//다음에서 '가', '나', '다' 어떤 걸 throw 해도 에러 메시지를 출력하도록 (라) 부분을 수정하시오. (type predicate)

type TPropertyKeyType = string | number | symbol;
type TUser = { [key: string]: string | number };

function deleteArray(arr: TUser[] | number[], startOrKey: TPropertyKeyType, endOrValue?: unknown) {
    if (typeof startOrKey === 'number') {
        if (typeof endOrValue === 'number') {
            return arr.filter((_, i) => i < startOrKey || i > endOrValue - 1);
        }
        return arr.slice(0, startOrKey);
    }

    if (typeof startOrKey === 'string') {
        arr.filter((e) => {
            if (e && typeof e === 'object') {   
                // e['id'];  error
                // e[startOrKey];  error
            }
        });
    }

    if (typeof startOrKey === 'symbol') {}

    return [];
}

const arr = [1, 2, 3, 4];
console.log(deleteArray(arr, 2)); // [1, 2]
console.log(deleteArray(arr, 1, 3)); // [1, 4]
console.log(arr); // [1, 2, 3, 4]

const users = [{ id: 1, name: 'Hong' }, { id: 2, name: 'Kim' }, { id: 3, name: 'Lee' }];

console.log(deleteArray(users, 2)); // [Hong, Kim]
console.log(deleteArray(users, 1, 2)); // [Hong, Lee]
console.log(deleteArray(users, 'id', 2)); // [Hong, Lee]
console.log(deleteArray(users, 'name', 'Lee')); // [Hong, Kim]
todo.title = "Hello"; // Error: cannot reassign a readonly property
todo.description = "barFoo"; // Error: cannot reassign a readonly property

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
=======
const sizeOption1 = { XS: 1, S: 5, M: 2, L: 2, XL: 4 };
const totalPrice1 = SIZE.reduce( ( currPrice, size ) => currPrice + sizeOption1[size.id] * size.price, 0);

const sizeOption2 = { XS: 2, S: 5, MM: 3, L:2 , XL: 4 };
const totalPrice2 = SIZE.reduce( (currPrice, size) => currPrice + sizeOption2[size.id] * size.price, 0);


// 다음을 interface로 어떻게 정의할까??    type Ud2 = (TUser | TDept) & {addr: string};

interface User {
  id: number;
  name: string;
}

interface Dept {
  id: number;
  dname: string;
  captain: string;
}

interface Ud2 {
  //<이 부분을 작성하시오>
  id : number;
  name ? : string;
  dname ? : string;
  captain ? : string;
 // [ x : string ] : number | string ;
  addr: string;
}

// 다음 코드가 오류가 없으면 통과!
const ud2: Ud2 = {id: 1, name: 'HH', addr: 'Seoul'};
const ud3: Ud2 = {id: 1, dname: 'HH', captain: 'HH', addr: 'Seoul'};
>>>>>>> 9cb0ef1cd9e5ad466a4c89cf4084f7a33895e475
