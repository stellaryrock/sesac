//1. T에서 K 프로퍼티만 선택해 새로운 오브젝트 타입을 만드는 내장 제네릭  Pick<T,K> 을 이를 사용하지 않고 구현하세요.

type Person = {
    name : string,
    age : number,
    city : string
}

type PersonPreview = MyPick<Person, 'name' | 'city'>

const  person: PersonPreview = {
  name : "김승진",
  city : "서울",
}

// type MyPick = <...> {...};
type MyPick<T, K extends keyof T> = {
  [key in K] : T[key]
}


//2. T의 모든 프로퍼티를 읽기 전용(재할당 불가)으로 바꾸는 내장 제네릭 Readonly<T>를 이를 사용하지 않고 구현하세요.
interface Todo {
  title: string
  description: string
}

type MyReadonly<T>{

}

const todo: MyReadonly<Todo> = {
  title: "Hey",
  description: "foobar"
}

todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property

// 문제1) 다음에서 T1과 동일한 타입으로 T2를 정의하시오.

const cart = {
  X: 1,
  Y: 2,
  Z: 3,
};

type T1 = "X" | "Y" | "Z";
type T2 = keyof typeof cart;

// 문제2) 다음에서 T3과 동일한 타입으로 T4를 정의하시오.

const constCart = {
    X: 1,
    Y: 2,
    Z: 3,
  } as const;
  
//type T3 = 1 | 2 | 3;
//type T4 = ??
  
  
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
