// 1. 
for( let i=0; i<1 ; i+=0.1){
  console.log( +i.toFixed(1) );
}

// 2.
for(let i=1; i<=10; i+=1){
  const root = Math.sqrt(i);
  if( root % 1 ) console.log(i, root.toFixed(3));
}


// 3.
const today = new Date().getDay();
const DAY = '일월화수목금토'[today];

console.log(`오늘은 ${DAY}요일 입니다.`);

// 소수점 자리수 구하기
function pLength(n){
  return n.toString().length - Math.trunc(n).toString.length;
}

function addPoints(a, b){
  const aLen = plegnth(a);
  const bLen = plength(b);

  //return (a+b).toFixed(aLen > bLen ? aLen : bLen)
  return (a+b).toFixed(Math.max(aLen, bLen));
}

function calc(signFlag, ...args){
  p = 10 ** 10;
  let ret = 0;
  
  for(const [i,n] of Object.entries(args)){
    console.log(i, n);
    const signNum = i !== 0 ? n * signFlag : n;
    ret += Math.trunc(signNum * p);
  }

  ret = ret / p;
  console.log( args.join(`${signFlag > 0 ?  '+' : '-'}`), '=', ret );
}

const prices = [ 10.34232323, 15, 'xxx', 5.67899, null , 20.9, 1.005121, 0, 15, undefined, 0.5 ];

const reduceSum =  (arr, p) => ({
    _acc : 0,
    _sum : 0,
    _arr : arr.filter( n => !isNaN(n) && n !== null ).map( n => Math.trunc(n * ( 10 ** p )) ),

    reduce(){
        this.sum = this._arr.reduce((acc, a) => acc + a, 0);
        return this;
    },

    divide(){
        this._acc = this.sum / this._arr.length;
        return this;
    },

    toNumber(){
        return Math.trunc(this._acc) / ( 10 ** p );
    }
});

const n = reduceSum(prices, 2).reduce().divide().toNumber();
console.log(n);


