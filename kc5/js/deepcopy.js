const obj = {
    id: 1,
    name: 'hong',
    age: 20,
    address : {
        city: 'incheon',
        country: 'korea'
    }
}

const arr = [ 'hong', 1, 20, {city: 'incheon', country: 'korea'}];


const deepCopy = (obj) => {
    if( typeof obj !== 'object' || obj === null){
        return obj;
    }

    const ret = Array.isArray(obj) ? [] : {};

    Object
    .entries(obj)
    .forEach(([key, value]) => {
        if(typeof value === 'object' && value !== null)
            ret[key] = deepCopy(value);
        else
            ret[key] = value;
    })

    return ret;
}


const shallowCopy = {...obj};
const newObj = deepCopy(obj);
const newArr = deepCopy(arr);


shallowCopy.address.city = 'seoul';
newObj.address.city = 'busan';
newArr[3].city = 'daegu';

Object.entries(obj).forEach(([k,v]) => console.log(k,v));
Object.entries(newObj).forEach(([k,v]) => console.log(k,v));

arr.forEach((e,i) => console.log(e,i));
newArr.forEach((e, i) => console.log(e, i));