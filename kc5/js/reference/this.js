globalThis.name = 'Global Name';

const obj = {
  name: 'Obj Name',
  printName() {
    console.log(this.name);
  },

  pName : function(){
    console.log(this.name);
  }
};

// �ּ� ���� �ѱ�ϱ�
const printName = obj.printName;  // <f.o> address
// obj = null;
printName();
obj.pName();