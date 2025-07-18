// 출처 : https://github.com/indiflex/kc5/blob/develop/ts/tt_utility_types.ts

const debounce = <F extends (...args: Parameters<F>) => ReturnType<F> >(fn : F, delay: number) => {
  let timer : ReturnType<typeof setTimeout>;

  return (...args : Parameters<F>)=>{
    if(timer) clearTimeout(timer);

    timer = setTimeout(fn, delay, ...args);
  }
}