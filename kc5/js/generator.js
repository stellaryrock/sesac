const assert = require('assert');

function* add() {
  const n1 = yield 'first number';
  const n2 = yield 'second number';

  return n1 + n2;
}

const itAdd = add();

// console.log(itAdd.next().value);
// console.log(itAdd.next(1).value);
// console.log(itAdd.next(2).value);

class Subway {
  constructor(s, e){
    this.s = s;
    this.e = e;

    this.LINE2 = [
          '신도림',
          '성수',
          '신설동',
          '용두',
          '신답',
          '용답',
          '시청',
          '충정로',
          '아현',
          '이대',
          '신촌',
          '공항철도',
          '홍대입구',
          '합정',
          '당산',
          '영등포구청',
          '문래',
          '대림',
          '구로디지털단지',
          '신대방',
          '신림',
          '봉천',
          '서울대입구',
          '낙성대',
          '사당',
          '방배',
          '서초',
          '교대',
          '강남',
          '역삼',
          '선릉',
          '삼성',
          '종합운동장',
          '신천',
          '잠실',
          '잠실나루',
          '강변',
          '구의',
          '건대입구',
          '뚝섬',
          '한양대',
          '왕십리',
          '상왕십리',
          '신당',
          '동대문역사문화공원',
          '을지로4가',
          '을지로3가',
          '을지로입구'
        ];
    
    
  }

  [Symbol.iterator] () {
    
    let startIdx = this.LINE2.indexOf(this.s);
    let endIndex = this.LINE2.indexOf(this.e); 
    let isEnd = false;

    let currentIndex = startIdx - 1;

    return {
      // next: () => (idx % this.LINE2.length) !== endIndex + 1 ? { value : this.LINE2[idx++ % this.LINE2.length ], done: false } : { value : undefined, done : true }
      next : () => {

        if( isEnd ) return { value : undefined , done : true };

        currentIndex = (currentIndex + 1) % this.LINE2.length;
        if(currentIndex === endIndex) isEnd = true;

        return { value: this.LINE2[currentIndex], done : false };
      }
    }
  }
}

const routes = new Subway('문래', '신림');
console.log([...routes]);

assert.deepStrictEqual(
  [...routes],
  ['문래', '대림', '구로디지털단지', '신대방', '신림']
);

const it1 = routes[Symbol.iterator]();
['문래', '대림', '구로디지털단지', '신대방', '신림'].forEach((value, i) => {
  assert.deepStrictEqual(it1.next(), { value, done: false });
  console.log(i, routes.toString());
});

assert.deepStrictEqual(it1.next(), { value: undefined, done: true });

const route3 = new Subway('문래', '합정'); // 46개 정거장이면 통과!
console.log([...route3])

assert.strictEqual([...route3].length, 46);

const route4 = new Subway('신도림', '을지로입구'); // 48개 정거장이면 통과!
assert.strictEqual([...route4].length, 48);

// return;


// iterable Stack, Queue

class Stack {
  constructor() {
    this._arr = [];
    this._idx = 0;
  }

  // [Symbol.iterator] = (this._arr[Symbol.iterator]) ?
  [Symbol.iterator]() {
    let i = 0;

    return {
      next: ()=>(
        i < this._arr.length ? {value : this._arr[i++] , done: false} : {done: true} 
      )
    }
  }

  isEmpty(){
    return this._arr.length === 0;
  }

  push(x){
    this._arr.push(x);
  }

  pop(){
    return this._arr.pop();
  }

  peek(){
    return this._arr[this._arr.length - 1];
  }
}

const s = new Stack();
s.push(1);
s.push(4);
s.push(7);
console.log("🚀 ~ s:", [...s])
