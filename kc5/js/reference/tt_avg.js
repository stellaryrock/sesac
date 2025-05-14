const prices = [
  10.34232323, 15, 'xxx', 5.67899, null, 20.9, 1.005121, 0, 15, undefined, 0.5
];


//precision
const P = 10 ** 2;

let sum = 0;
let cnt = 0;

for( const price of prices)
{
  if( price === null || isNaN(price)) break;
  sum += price * P ;
  cnt += 1;
}
const avg = Math.trunc( sum / cnt ) / P;

for ( const price of prices)
{
  //const price = p !== null ? Number(p) : null;
  //if (typeof price !== 'number') continue;
  //if (typeof price !== 'number' && isNaN(price))
  //continue;


}