const memoizedFn = (fn) => {
    let cache = {};
    console.log(cache);

    return k => cache[k] || (cache[k] = fn(k));
}


const fibo = (n) => {
    if( n === 1 ) return 0;
    if( n === 2 ) return 1;

    return fibo(n-1) + fibo(n-2);
}


const memoizedFibo = memoizedFn(fibo);

for(let i = 1 ; i< 10; i++){
    console.log( fibo(i) );
}

