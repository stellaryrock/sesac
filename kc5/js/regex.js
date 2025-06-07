// 다음 코드를 실행하면 'OK'는 몇 번 출력될까? 
// 3번이 출력되지 않는다. 이유는? 그리고 해결책은?

/*
test() g 플래그가 있는 정규식에서 내부에 lastIndex 가 유지됨.
lastIndex 는 마지막 test() 호출 시 찾은 값의 인덱스를 가지고 있음 
*/
const regex = /abc/g;

console.log(regex.lastIndex);
console.log(regex.test('abc abc')) // true
console.log(regex.lastIndex);
console.log(regex.test('abc abc')) // true
console.log(regex.lastIndex);
console.log(regex.test('abc abc')) // false
console.log('not found' , regex.lastIndex);

const regexp = /senior|coding/gi;

if (regexp.test('Junior Developer')) console.log('1 OK');
console.log(regexp.lastIndex); // 0 
if (regexp.test('Senior Developer')) console.log('2 OK');
console.log('found', regexp.lastIndex); // 6
if (regexp.test('JS Coding')) console.log('3 OK');
console.log(regexp.lastIndex); // 6
if (regexp.test('JavaScript Coding')) console.log('4 OK');
console.log(regexp.lastIndex); // 17