const prices = [ 10.34232323, 15, 'xxx', 5.67899, null , 20.9, 1.005121, 0, 15, undefined, 0.5 ];


const reduceSum =  (arr, p) => ({
    _acc : 0,
    _sum : 0,
    _arr : arr.filter( n => !isNaN(n) && n !== null ).map( n => Math.trunc(n * ( 10 ** p )) ),

    reduce(){
        console.log(this._arr);
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

