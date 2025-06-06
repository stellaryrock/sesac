// class 는 new 없이 생성자 함수를 호출할 수 없다.

// class TryThis{
//   constructor(){
//     console.log('constructor...');
//     this.items = [];
//   }
// }


function TryThis()
{
  console.log('trythis...');
  this.items = [];
  
}

const tt = new TryThis();
const ttf = TryThis();
console.log(tt, ttf, globalThis.items );
console.log( tt.constructor.prototype );
console.log( tt.Prototype, TryThis.prototype, tt.__proto__, TryThis.__proto__);