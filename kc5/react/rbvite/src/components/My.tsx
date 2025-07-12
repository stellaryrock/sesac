import type { FormEvent } from "react";
import type { Cart, Session, LoginFn } from "../App";
import {useRef, useState} from "react";
import Login from "./Login";
import Profile from "./Profile";
// import * as mycss from "./My.css"

type Props = {
  session : Session;
  login : LoginFn;
  logout : () => void;
  removeItem : (id : number) => void;
  addItem : (name: string, price: number) => void;
  editItem : (item : Cart) => void;
};

const My = ({ session: { loginUser, cart }, login, logout, removeItem, addItem, editItem }: Props) => {
  console.log("@@@My");

  const itemNameRef = useRef<HTMLInputElement>(null);
  const itemCostRef = useRef<HTMLInputElement>(null);
  const [workingItem, setWorkingItem] = useState<Cart | null>(null);

  // useEffect(()=>{
  //   if( workingItem !== null ){
  //     itemNameRef.current?.value = workingItem.id;
  //     itemCostRef.current?.value = workingItem.name;
  //   };
  // }, [workingItem]);

  const submitItem = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const name = itemNameRef.current?.value;
    const cost = itemCostRef.current?.value;
    
    if(!name){
      alert("상품명을 입력하세요.");
      itemNameRef.current?.focus();

      return;
    }

    if(!cost){
      alert("가격을 입력하세요.");
      itemCostRef.current?.focus();

      return;
    }

    addItem(name, +cost);
  };

  return (
    <>
      {loginUser ? (
        <Profile loginUser={loginUser} logout={logout} />
      ) : (
        <Login login={login} />
      )}
      <ul>
        {cart.map(({ id, name, price }) => (
          <li key={id}>
            <a href="#" onClick = {()=>{setWorkingItem({id, name, price})}}>
              {name}({price.toLocaleString()})
              <button className = "btn btn-sm red" onClick={() => {removeItem(id)}}>
                X
              </button>
            </a>
          </li>
        ))}
      </ul>

      { workingItem ? 
        <form action="submit" onSubmit = { (evt : FormEvent<HTMLFormElement>) => {evt.preventDefault(); editItem(workingItem);} }>
          <div>
            <span>상품명:</span><input ref = { itemNameRef } type="text" placeholder = "상품명" defaultValue = {3000}/>
          </div>
          <div>
            <span>가격:</span><input ref = { itemCostRef } type="text" placeholder = "가격" />
          </div>
          <button type="submit">수정하기</button>
        </form>
        :
        <form action="submit" onSubmit={submitItem}>
          <div>
            <span>상품명:</span><input ref = { itemNameRef } type="text" placeholder="상품명" />
          </div>
          <div>
            <span>가격:</span><input ref = { itemCostRef } type="number" placeholder="가격" defaultValue={3000}/>
          </div>
          <button type="submit">추가하기</button>
        </form>
      }
    </>
  );
};

export default My;
