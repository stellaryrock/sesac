const outStr : string = "hello typescript!"

const myName : string = "kjs";

const PRIMITIVE : Array<string> = ['number', 'object', 'undefined', 'bigint', 'null', 'Symbol', 'string']

const arr = [1, {id:3}, Symbol('Hi'), null, undefined, 'hi']

arr.forEach( (element, i) => console.log(typeof element) );

let x : number | string = 3;

x = '123';