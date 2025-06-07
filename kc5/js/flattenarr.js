function flattenArray(arr) {
  let result = [];

  arr.forEach((item) => {
    if (Array.isArray(item)) {
      //result.concat(flattenArray(item));
      result = result.concat(flattenArray(item));
    } else {
      console.log(item); // 1,2,3,4
      result.push(item);
    }
  });

  return result;
}

console.log(flattenArray([1, [2, [3, [4]]]]));

