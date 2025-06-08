const assert = require('assert');

// step 1

function _isPrime(n) {
    if( n === 2 || n === 3) return true;

    for(let i=2; i<n ; i++){
        if( n % i === 0) return false;
    }

    return true;
}

//

function isPrime(n){
    if( n <= 1 ) return false;
    if( n <= 3 ) return true;
    
    if( n % 2 === 0 || n % 3 === 0) return false;

    for(let i = 5; i*i <= n; i += 6 ){
        if( n % i === 0 || n % (i+2) === 0 ) return false; 
    }

    return true;
}

assert.deepStrictEqual(isPrime(11) , true);
assert.deepStrictEqual(isPrime(2), true);
assert.deepStrictEqual(isPrime(3), true);
assert.deepStrictEqual(isPrime(4), false);




