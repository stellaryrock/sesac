function makeObjectFromArray(arr) {
  for (i in arr) {
    let [, ...rest] = arr[i];
    arr[i] = [arr[i][0], rest];
  }
  return Object.fromEntries(arr);
}

function makeArrayFromObject(obj) {
  const res = Object.entries(obj);
  for (i in res) {
    res[i] = [res[i][0], ...res[i][1]];
  }
  return res;
}

const data = [
  ["A", 10, 20],
  ["B", 30, 40],
  ["C", 50, 60, 70],
];

const dataObj = makeObjectFromArray(data);
const dataArr = makeArrayFromObject(dataObj);

console.log("? ~ dataObj:", dataObj);
console.log("? ~ dataArr:", dataArr);


function shallowCopy(obj) {
  const res = {};
  for (const i in obj) {
    res[i] = obj[i];
  }
  return res;
}

function deepCopy(obj) {
  const ret = {};

  for (const i in obj) {
    if( typeof obj[i] === "object" )
    {
     ret[i] =  deepCopy(obj[i]) 
    }
    else{
     ret[i] =  obj[i];
    }
  }
  return ret;
}