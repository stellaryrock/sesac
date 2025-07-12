export const addFloat = (p : number) => {

  const check = ( n : unknown ) : number => isNaN( Number(n) ) || n === null ? 0 : n as number;

  return (a: unknown, b: unknown) => {
    const _a = check(a);
    const _b = check(b);
    
    const _adjust = 10 ** p;

    return Math.trunc( _a * _adjust + _b * _adjust ) / _adjust ;
  }
}