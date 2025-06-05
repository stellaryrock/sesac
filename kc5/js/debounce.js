const debounce = ( cb, delay ) => {
    let timer;
    console.log(timer);

    return (...args) => 
        {
            if(timer) clearTimeout(timer) ; 
            timer = setTimeout(cb, delay, ...args) ;
        }
}

const cb = (a,b,c) => console.log(a,b,c ,' ... 함수 실행됨');

const act = debounce( cb, 4000 );
setTimeout(()=>console.log('대략 4000ms 지난 후...'), 4000);
setTimeout(()=>console.log('대략 7500ms 지난 후...'), 7500);
act(1,2,3);
setTimeout(()=>{act(4,5,6)}, 3500);