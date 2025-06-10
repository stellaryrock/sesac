const obj = {
    sym : Symbol('hi'),
    id: 1,
    name: 'hong',
    age: 20,
    address : {
        city: 'incheon',
        country: 'korea'
    },
//    set: new Set([1,2,3]),
//    [Symbol('hi')] : 'hi',
//    fn : function() { console.log('hi'); }
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

console.log( obj, newObj );


// 원시값만을 갖는 객체 kim을 복사하는 프로그램을 Object 의 클래스 메소드 또는 spread(...) 연산자를 사용하지 말고 작성하시오.
const _shallowCopy = (obj) => {
    let newObj = {};

    for(key in obj){
        newObj[key] = obj[key];
    }

    return newObj;
}

let newObj2 = _shallowCopy(obj);
console.log( obj , newObj2 );
newObj2.address.city = 'newObj';
console.log( obj, newObj2 );

const _deepCopy = (obj) => {
    let ret = {};

    for(key in obj){
        let val = obj[key];
        ret[key] = (typeof val !== 'object' || val === null) ? val : _deepCopy(val);
    }

    return ret;
}

let newObj3= _deepCopy(obj);
console.log( obj, newObj3 );

obj.address.city = 'obj';
console.log( obj, newObj3 );
console.log( obj, shallowCopy, newObj );
