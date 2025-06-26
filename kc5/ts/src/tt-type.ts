//const isStringNumber = (value: unknown): value is [string, number] =>
  //<이 부분을 작성하시오>
  
const f1 = (value: number | string | boolean | [string, number]) => {

    if (isStringNumber(value)) {
      console.log(value[0].toUpperCase(), value[1].toFixed());
    }

};



interface Animal {}
interface Dog extends Animal {
    name: string;
}
interface Cat extends Animal {
    punch(): void;
}

//class Retriever implements Dog {}

// function isDog(a: Animal): a is Dog {
// 	<이 부분을 작성하시오>
// }
