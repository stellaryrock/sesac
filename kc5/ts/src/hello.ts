const outStr : string = "hello typescript!"

console.log(outStr);

const PRIMITIVE : Array<string> = ['number', 'object', 'undefined', 'bigint', 'null', 'Symbol', 'string']

const arr = [1, 123n, {id:3}, Symbol('Hi'), null, undefined, 'hi']

arr.forEach( (element, i) => console.log(typeof element) );

let x : number | string = 3;

x = '123';