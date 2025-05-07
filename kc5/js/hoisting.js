console.log("Running js file...");
//console.log("a: ", a);  // ReferenceError
//console.log("i: ", i);  // ReferenceError
console.log("b: ", b); //b: undefined
call0();  // 함수 선언이 이루어짐

function call0()
{
  var a = 1;
  let i = 0;

  console.log("Inner call0, a :", a, "i: ", i);
}

var b;
