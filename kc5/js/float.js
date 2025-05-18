let number = 123.4;

function add(num1, num2){
  function makeFloat(num, precision = 1){
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

  let float1 = makeFloat(num1);
  let float2 = makeFloat(num2);

  return float1.add(float2);
}

let float3 = add( 1.234, 234.2 );

console.log(float3);