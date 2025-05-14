// 0.1 ... 0.9 , 1 출력
for(let i=1 ; i<=10; i++)
{
  console.log( i / 10 );
}



//다음 소수 배열의 평균을 소수점 2자리까지 구해보세요.
//(단, toFixed를 사용하지 말고, 정상적인 숫자가 아닌 경우는 평균에서 제외하세요!)


const prices = [10.34232323, 15, 'xxx', 5.67899, null, 20.9, 1.005121, 0, 15.234, undefined, 0.5];


for( const p of prices )
{
  if( isNaN(p) || p !== null ) break;
  console.log(p);
}