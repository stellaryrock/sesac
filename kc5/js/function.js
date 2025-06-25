const once = (fn) => {
  let runnable = true;

  return (...args) => {
    if( runnable ){
      runnable = !runnable;
      return fn(...args);
    }

    return undefined;
  }
};

const fn = once( (x, y) => console.log( x, y ) );


console.log("?��? ~ fn:", fn(2,4))
// console.log("?��? ~ fn:", fn(3,5))

// console.log("?��? ~ fn:", fn(4,6))


function template(txt, a,b,c){
  console.log( `txt: ${txt}`) ;
  console.log( ` a: ${a}`);
  console.log( ` b: ${b}`);
  console.log( ` c: ${c}`);
}

template`?��?��?��?��?�� ${1} ${2} ${3}`;
