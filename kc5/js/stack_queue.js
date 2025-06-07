//class와 Array를 이용하여 Stack과 Queue를 구현하시오.

class Stack{
  constructor(){
    this.items = [];
  }

  push(item){
    this.items.push(item);
  }

  pop(item){
    return this.isEmpty() ? null : this.items.pop(item); 
  }

  peek(){
    return this.isEmpty() ? null : this.items[this.items.length - 1];
  }

  isEmpty(){
    return this.items.length === 0;
  }

  clear() {
    this.items = [];
  }

  data() {
    return [...this.items];
  }
}



//ex1) Stack
const stack = new Stack(); // or new Stack(1,2); // ⇐⇒ (1,2)
console.log(stack.pop(), stack.peek());
stack.push(3); // 추가하기
console.log(stack.pop()); // 마지막에 추가된 하나 꺼내기

return; 

//ex2) Queue
const queue = new Queue();
queue.enqueue(3); // 추가하기
queue.enqueue(2); // 추가하기
console.log(queue.dequeue()); // 추가한지 가장 오래된 - 먼저 들어간 - 하나 꺼내기
