function Dog(name, power) {
  // let dog = {};
  // dog.name = name;
  // dog.power = power;

  const dog = Object.create(Dog.prototype);
  // Object to use as a prototype. May be null.
  // Creates an object that has the specified prototype or that has null prototype.

  this.name = name;
  this.power = power;

  return this;
}

Dog.prototype.eat = function (amount) {
  console.log(`${this.name} is eating.`);
  this.power += amount;
};

const maxx = new Dog('Maxx', 7); 
maxx.eat(5);

// constructor 포함하여 모든 멤버 메서드는 prototype 에...
// 모든 멤버 변수는 heap 에...

// 생성자 함수는 프로토타입에
// 생성자 함수는 this 를 리턴하기 위한 함수.
// prototype 은 별개의 인스턴스


// class def / function def 모두 힙에 있고 전역 객체가 참조.
// 따라서 클래스도 this 를 가질 수 있다.
// static 은 고정된 크기의 영역이어서 주솟값을 담는다.

// mix in - 어댑터 패턴
// aop - 프록시 패턴

function f()
{
  console.log('f');
}

f.__proto__ === Function.prototype;

Object.prototype.print = function(){ };
//______/_________

obj = {};
console.log( obj.__proto__ );
console.log( Object.prototype );


