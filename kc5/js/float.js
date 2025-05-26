const prices = [
  10.34232323, 15, 'xxx', 5.67899, null, 20.9, 1.005121, 0, 15, undefined, 0.5
];

let addFloat = (p) => (num1, num2) => {
  if( num1 === null || isNaN(num1) ) num1 = 0;
  if( num2 === null || isNaN(num2) ) num2 = 0;

  return Math.trunc( num1 * (10 ** p) + num2 * (10 ** p) ) / (10 ** p);
}

let sum = prices.reduce(addFloat(2));
console.log("🚀 ~ sum:", sum)

const add = addFloat(1);

for( i = 0.1; i <= 1; i = add(i , 0.1) )
{
  console.log(i);
}
