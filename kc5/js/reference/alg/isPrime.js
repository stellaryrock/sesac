const assert = require('assert');

// step 1

function isPrime(n) {
    if( n === 2 || n === 3) return true;

    for(let i=2; i<n ; i++){
        if( n % i === 0) return false;
    }

    return true;
}

//

assert.deepStrictEqual(isPrime(11) , true);
assert.deepStrictEqual(isPrime(2), true);
assert.deepStrictEqual(isPrime(3), true);
assert.deepStrictEqual(isPrime(4), false);




