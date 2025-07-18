// 출처 : https://github.com/indiflex/kc5/blob/develop/ts/tt_utility_types.ts

const throttle = <F extends (...args : Parameters<F>)=>ReturnType<F>>(cb: F, delay: number) => {
  let timer : ReturnType<typeof setTimeout> | null;

  return (...args : Parameters<F>) => {
    if(timer) return;
    
    timer = setTimeout(()=>{
      cb(...args);
      timer = null;
    }, delay);
  } 
}