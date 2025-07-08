// 두 타입을 합치는 Combine 유틸리티 타입 만들기
// * 힌트: 두 타입의 같은 key 라면 union type, 그렇지 않다면 각 타입의 key type
//   - 공통키: 키들의 교집합(keyof T & keyof U)

interface IUser {
    id: number;
    age: number;
    name: string;
}

interface IDept {
    id: number;
    age: string;
    dname: string;
    captain: string;
}


type Combine<T, U> = 
type ICombined = Combine<IUser, IDept>;

///------------------------------------------------------------------------------------------------///
// 다음 객체들을 하나로 합쳐(extend) 보세요. (id, name, age, addr)


let users = [
    {name: 'Hong'},
    {age: 23},
    {id: 1, addr: 'Seoul'},
];

type FullUser<T> = Record< keyof (T extends (infer I)[] ? I : never), string | number >;

type __ = FullUser<typeof users>

const ret: FullUser = users.reduce( (acc, user) => ({...acc, ...user}), {});

///------------------------------------------------------------------------------------------------///
// 두 타입을 합치고 일부는 제외하는 CombineExclude 유틸리티 타입 만들기
// * 힌트: 두 타입의 같은 key 라면 union type, 그렇지 않다면 각 타입의 key type

interface IUser {
    id: number;
    age: number;
    name: string;
}

interface IDept {
    id: number;
    age: string;
    dname: string;
    captain: string;
}

type CombineExclude<T, U, P> = {
    [k in keyof (T & U)]: k extends P ? never : (T & U)[k];
};

type _ = { [k in  keyof (IUser & IDept )] : k extends 'name' | 'dname' ? never : '2' }

type ICombineExclude = CombineExclude<IUser, IDept, 'name' | 'dname'>;

let combineExclude: ICombineExclude = {
    id: 0,
    age: 33,
    captain: 'ccc',
};
          
///------------------------------------------------------------------------------------------------///

//특정 함수의 인자 타입을 추출하는 유틸리티 타입을 작성하시오. (infer)
type FirstArgs<F> = F extends (...args : [...(infer Arg)]) => infer Ret ? Arg[0] : never;
type SecondArgs<F> = F extends (arg : FirstArgs<F>, arg2 : infer args2, ...args: unknown[] ) => infer Ret ? args2 : never;
type Args<F> = F extends ( ...args : [...(infer Arg)]) => infer Ret ? Arg : never;

type tt<F> = F extends ( f1 : any, f2: any ) => void ? typeof f1 : never;

type x = tt<typeof add>;


function add(a: number, b: string) { 
    return `${a} - ${b}`;
};

type A = FirstArgs<typeof add>;  // number
type B = SecondArgs<typeof add>; // string
type C = Args<typeof add>;    // number | string

type AX = Args<typeof String.prototype.endsWith>;
    // ⇒ string | number | undefined
type AX = Args<typeof String.prototype.charAt>;
    // ⇒ number
///------------------------------------------------------------------------------------------------///

//regist 함수가 다음과 같을 때 파라미터 처리를 해보세요.
function registUserObj({ name, age }: {name: string; age: number}) {
  const id = 100;
  return { id, name, age };
}

type RegistUserObj = Parameters<typeof registUserObj>[0];

const paramObj: RegistUserObj = { name: 'Hong', age: 32 };
const newUser2 = registUserObj(paramObj);
console.log('🚀  newUser2:', newUser2);

//------------------------------------------------------------------------------------------------//

// debounce와 throttle 함수를 TypeScript로 작성하시오.
// args 를 제너릭으로
type debounce<T extends (...args : any[]) => void > = function( cb : T, delay : number ) : ReturnType<T> {
    let timer : ReturnType<typeof setTimeout> | undefined = undefined ;

    if( timer ){
        clearTimeout(timer);
    }
    timer = setTimeout(cb);
} 

// 콜백을 제너릭으로 , 제너릭에 콜백 형식으로 제너릭을 제약 걸기.


// test
// const debo = debounce((a:number, b: string) => console.log(a + 1, b), 1000);
// for (let i = 10; i < 15; i++) debo(i, 'abc');   // 15, 'abc'

// const thro = throttle((a:number) => console.log(a + 1), 1000);
// for (let i = 10; i < 15; i++) thro(i);   // 11

///------------------------------------------------------------------------------------------------///

// Promise.allSettled와 동일한 promiseAllSettled 함수를 TS로 작성하시오.

// function promiseAllSettled…

// // test
// assert.deepStrictEqual(
//   await Promise.allSettled([randTime(1), randTime(2),randTime(3)]),
//   await promiseAllSettled([randTime(1), randTime(2),randTime(3)])
// );

// assert.deepStrictEqual(
//   await Promise.allSettled([randTime(11), Promise.reject('REJECT'), randTime(33)]),
//   await promiseAllSettled([randTime(11), Promise.reject('REJECT'), randTime(33)])
// );

///------------------------------------------------------------------------------------------------///

// JS 시간에 작성했던 memoized 함수를 범용성을 고려하여 TS로 작성하시오.
// function memoized
// JSON.stringify([1,2]);
// // test
// const memoizeAdd = memoize((a: number, b: number) => {
//   return a + b;
// });

// console.log(memoizeAdd(1, 2))); // 3
// console.log(memoizeAdd(3, 4))); // 7

// const memoizeFactorial도 테스트(실행)) 해보세요!

///------------------------------------------------------------------------------------------------///
export {};