function add(num1, num2, precision = 1){  
  if( num1 === null || isNaN(num1) ) return NaN;
  if( num2 === null || isNaN(num2) ) return NaN;

  function makeFloat(num, precision){
    let adjustedNum = Math.trunc(num * ( 10 ** precision )); 

    return {
      getNum(){
        return [adjustedNum, precision];
      },
      add(other) {
        [otherNum, otherPrecision] = other.getNum();

        return (adjustedNum+otherNum) / ( 10 ** precision );
      }
    }
  }

  let float1 = makeFloat(num1, precision);
  let float2 = makeFloat(num2, precision);

  return float1.add(float2);
}

let test = [
  add( 1.234, 234.2, 2 ),  // 235.4;
  add( '123', 1.23, 1 ),   // 124.2;
  add( null, 123.12 )   // NaN
]

for( t of test )
{
  console.log(t);
}

for( i = 0.1; i <= 1; i = add(i , 0.1) )
{
  console.log(i);
}