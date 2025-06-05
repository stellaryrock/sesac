const assert = require('assert');


const isPrimeNormal = (n) => {

}

const hasPrime = arr => arr.some(isPrimeNormal);

const primeNumbers = (arr) => arr.filter(isPrimeNormal);


assert.strictEqual(hasPrime([1,2,3]), true);