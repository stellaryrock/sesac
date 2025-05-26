console.log(a);
tt();
var a = 10;
t = 20;
console.log(globalThis.a);
console.log(globalThis.t);
console.log(globalThis);
function tt()
{
  ttt();
  function ttt()
  {
    console.log(globalThis);
  }
}