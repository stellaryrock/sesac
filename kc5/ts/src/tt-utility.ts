// 1 . Record<KeyType, ValueType>

type R = Record<string, number>;
// type R = { [k:string]: number };

// 2. 다음 객체들을 하나로 합쳐(extend) 보세요. (id, name, age, addr)

let users = [
    {name: 'Hong'},
    {age: 23},
    {id: 1, addr: 'Seoul'},
];

type FullUser = {

};

const ret: FullUser = users.reduce( (acc, user) => ({...acc, ...user}), {});


export {};


// 3. 두 타입을 합치고 일부는 제외하는 CombineExclude 유틸리티 타입 만들기
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


type Combine<T, U> = keyof T & keyof U;
type ICombineExclude = CombineExclude<IUser, IDept, 'name' | 'dname'>;


let combineExclude: ICombineExclude = {
    id: 0,
    age: 33,
    captain: 'ccc',
};
          