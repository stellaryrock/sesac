let xuser : { 
  id: number; 
  name : string
};

xuser = { 
  id : 1, 
  name : 'xx',
  // age : 30; 
};


const tmp = { id : 1, name: 'xx', age: 30 };
xuser = tmp;

const lee = { id : 1 , name : 'Lee' };
const kim = { id : 2, name : 'Kim', addr: 'Seoul'};

type Emp = { id : number; name: string; };

const arr: Emp[] = [
  { id: 1, name: 'Hong' }, 
  { id: 2, name: 'Kim', addr: 'Seoul'}
];
