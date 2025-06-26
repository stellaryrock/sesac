
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

