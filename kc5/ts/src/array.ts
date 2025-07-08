export const push = (arr : unknown[], ...args : unknown[]) => [...arr, ...args];    

export const pop = (arr : unknown[] , n : number = 1) =>  (n === 1 ?  arr[arr.length -1] : [...arr.slice(arr.length - n)] );

export const unshift = (arr : unknown[] , ...args : unknown[] ) => [...args, ...arr];

export const shift = ( arr : unknown[], n : number = 1 ) => [arr.slice(0, n), arr.slice(n)];