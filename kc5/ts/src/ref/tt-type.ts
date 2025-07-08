const isStringNumber = (value: unknown): value is [string, number] =>
//<이 부분을 작성하시오>
{
  return Array.isArray(value) && value.length === 2 && typeof value[0] === 'string' && typeof value[1] === 'number';
}

const f1 = (value: number | string | boolean | [string, number]) => 
{
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

function isDog(a: Animal): a is Dog {
	return typeof a === 'object' && a !== null && a.hasOwnProperty("name");
}

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

//////////////////////////////////////////////////////////////////////////////////////////////

// const arr = [1, 2, 3, 4];
// console.log(deleteArray(arr, 2)); // [1, 2]
// console.log(deleteArray(arr, 1, 3)); // [1, 4]
// console.log(arr); // [1, 2, 3, 4]

// const users = [{ id: 1, name: 'Hong' }, { id: 2, name: 'Kim' }, { id: 3, name: 'Lee' }];

// console.log(deleteArray(users, 2)); // [Hong, Kim]
// console.log(deleteArray(users, 1, 2)); // [Hong, Lee]
// console.log(deleteArray(users, 'id', 2)); // [Hong, Lee]
// console.log(deleteArray(users, 'name', 'Lee')); // [Hong, Kim]

type TUser = {
  id : number,
  name : string
};

const deleteArray = (array : number[] | TUser[], startIdxOrKey : number | keyof TUser, endIdxOrValue = array.length) => {
    const cb =
      typeof startIdxOrKey === 'number'
        ? (_, i : number) => i < startIdxOrKey || i >= endIdxOrValue
        : (a : TUser) => a[startIdxOrKey] !== endIdxOrValue;

    return array.filter(cb);
};

