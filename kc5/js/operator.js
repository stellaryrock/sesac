// �������� ����
let n;

n =  1 + 5; // ��� ������, ���� / ����( ++, -- �� );
let s = 'a'; // �Ҵ� ������

s + 'bc'; // ���ڿ� ����(����) ������ <=> template literal  `${abc}` // ���ڿ� ���� �����ں��� template literal Ȱ���� �� ȿ������
n > 5 ; // �� ������ cf. typeof/instanceof/isArray
s === 'a'; // �� �� (logical comparison) ������ ( cf. !== )
console.log( NaN === NaN ); // true? Nah....c false
console.log( isNaN(NaN) );

!( n===6  || s === 'a' ) // <=> n !== 6 && s !== 'a'

q = ( p = x = 1, y = 2, z = 3 );
2 ** 3;

var arr; 
console.log( "arr: ", arr );
console.log( "arr?.length: " ,arr?.length ); // 0

arr = arr ?? []; arr?.length;
console.log(arr);