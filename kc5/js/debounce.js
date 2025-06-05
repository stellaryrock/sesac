const debounce = (cb, delay) => {
    let timer ;

    timer ? clearTimeout(timer) : timer = setTimeout(cb, delay); 
}

const callbackFn = () => console.log('test') ;

debounce( callbackFn, 5000 );