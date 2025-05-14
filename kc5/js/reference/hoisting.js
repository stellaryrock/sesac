
var x  = 15;
console.log(f); // f: undefined
//f(); // error 

if(x<= 10)
{
  console.log(x);
  f();
  
  function f()
  {
    let xx = 10;
    console.log('f()');
  } 
}

