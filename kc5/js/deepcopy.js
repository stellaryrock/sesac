const obj = {
    id: 1,
    name: 'hong',
    age: 20,
    address : {
        city: 'incheon',
        country: 'korea'
    },
    [Symbol('hi')] : 'hi',
    fn : function() { console.log('hi'); }
}

const arr = [ 'hong', 1, 20, {city: 'incheon', country: 'korea'}];


const deepCopy = (obj) => {
    if( typeof obj !== 'object' || obj === null){
        return obj;
    }

    const ret = Array.isArray(obj) ? [] : {};

    Reflect
    .ownKeys(obj)
    .forEach(key => {
        value = obj[key];
        ret[key] = (typeof value === 'object' && value !== null) ? deepCopy(value) : value;
        // if(typeof value === 'object' && value !== null)
        //     ret[key] = deepCopy(value);
        // else
        //     ret[key] = value;
    })

    return ret;
}


const shallowCopy = {...obj};
const newObj = deepCopy(obj);
const newArr = deepCopy(arr);

shallowCopy.address.city = 'seoul';
newObj.address.city = 'busan';

console.log( obj, shallowCopy, newObj );