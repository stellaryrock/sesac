// 0.1 ... 0.9 , 1 ���
for(let i=1 ; i<=10; i++)
{
  console.log( i / 10 );
}



//���� �Ҽ� �迭�� ����� �Ҽ��� 2�ڸ����� ���غ�����.
//(��, toFixed�� ������� ����, �������� ���ڰ� �ƴ� ���� ��տ��� �����ϼ���!)


const prices = [10.34232323, 15, 'xxx', 5.67899, null, 20.9, 1.005121, 0, 15.234, undefined, 0.5];


for( const p of prices )
{
  if( isNaN(p) || p !== null ) break;
  console.log(p);
}