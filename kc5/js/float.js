let number = 123.4;

function add(num1, num2){
  // num1 or num2 가 string 형태의 숫자여도 잘 되는 이유..?
  if( num1 === null || isNaN(num1) ) return NaN;
  if( num2 === null || isNaN(num2) ) return NaN;

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

let float3 = add( 1.234, 234.2 ) // 235.4;
let float4 = add ( '123', 1.23 ) // 124.2;
console.log(float3, float4);