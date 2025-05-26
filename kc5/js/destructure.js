// 다음 user 객체에서 passwd 프로퍼티를 제외한 데이터를 userInfo
// 라는 변수에 할당하시오.
const user = {id: 1, name: 'Hong', passwd: 'xxx', addr: 'Seoul'}
// console.log(userInfo);
// 출력결과: {id: 1, name: 'Hong', addr: 'Seoul'}

const { passwd, ...userinfo } = user;

console.log("🚀 ~ userinfo:", userinfo)


// 다음 arr에서 3개의 id를 id1, id2, id3로 할당하시오. 
// (destructuring 활용)

const arr = [[{id: 1}], [{id:2}, {id: 3}]]
// cf. const id1 = arr[0][0].id; // Bad

const [[{id:id1}], [{id:id2},{id:id3}]  ]  = arr;


console.log(id1, id2, id3); 
// 출력결과: 1 2 3
