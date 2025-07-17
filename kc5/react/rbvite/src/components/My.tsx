import type { CartItem, Session } from '../App';
import Login from './Login';
import Profile from './Profile';
import './My.css';
import { useRef, useState, type FormEvent, type RefObject } from 'react';

type Props = {
  session: Session;
  logout: () => void;
  login: (id: number, name: string) => void;
  addItem: (newer: CartItem) => void;
  removeItem: (id: number) => void;
  editItem: (newer: CartItem) => void;
};

export default function My({
  session,
  login,
  logout,
  addItem,
  removeItem,
  editItem
}: Props) {

  const nameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);

  const [workingItem, setWorkingItem] = useState<CartItem | null>(null);

  // const editItem = (id : number , name: string, price : number) => {
  //   idRef.current!.value = String(id);
  //   nameRef.current!.value = name;
  //   priceRef.current!.value = String(price);
  // }

  const saveCartItem = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!nameRef.current || !priceRef.current) return;

    const id = workingItem ? workingItem.id : 0;
    const name = nameRef.current?.value;
    const price = priceRef.current?.value;

    let key: string | undefined;
    let ref: RefObject<HTMLInputElement | null> = nameRef;

    if (!name || !name?.trim()) {
      key = '상품명';
      ref = nameRef;
    }


    if (!price) {
      key = '가격';
      ref = priceRef;
    }

    if (key) {
      alert(`${key} 값을 입력하세요!`);
      ref?.current?.focus();
      return;
    }

    const isEditing = !!workingItem;
    const action = isEditing ? editItem : addItem;
    action({ id: Number(id), name: name!, price: Number(price) });

    nameRef.current.value = '';
    priceRef.current.value = '';
    setWorkingItem(null);
  };

  const setWorkingItemValues = (workingItem : CartItem) => {
    if(!nameRef.current || !priceRef.current)
      return;

    nameRef.current.value = workingItem.name;
    priceRef.current.value = String(workingItem.price);
    
    setWorkingItem(workingItem);
  }

  return (
    <>
      {session.loginUser ? (
        <Profile logout={logout} loginUser={session.loginUser} />
      ) : (
        <Login login={login} />
      )}

      <ul>
        {session.cart.map(({ id, name, price }) => (
          <li key={id}>
              <a href="#" onClick={()=>setWorkingItemValues({ id, name, price})}>
                <small>{id}</small> {name}
                <small>({price.toLocaleString()})</small>
              </a>
              <button
                onClick={() => removeItem(id)}
                className='btn btn-sm red'
                title='아이템 삭제'
              >
                X
              </button>
          </li>
        ))}
      </ul>
       
      <form className='item-form' onSubmit={saveCartItem}>
        <input type='text' ref={nameRef} />
        <input type='number' ref={priceRef} />
        <button type='reset' onClick={()=>setWorkingItemValues({id: 0, name:'', price: 0})}>취소</button>
        <button type='submit'>{workingItem ? "수정" : "등록"}</button>
      </form>
    </>
  );
}