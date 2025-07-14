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
  modifyItem: (newer: CartItem) => void;
};

export default function My({
  session,
  login,
  logout,
  addItem,
  removeItem,
  modifyItem
}: Props) {
  const [modifying, setModifying] = useState(false);

  const idRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);

  const onClickList = (id : number , name: string, price : number) => {
    setModifying(true);

    idRef.current!.value = String(id);
    nameRef.current!.value = name;
    priceRef.current!.value = String(price);
  }

  const modifyCartItem = (evt : FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!idRef.current || !nameRef.current || !priceRef.current) return;

    const id = idRef.current?.value;
    const name = nameRef.current?.value;
    const price = priceRef.current?.value;

    let key: string | undefined;
    let ref: RefObject<HTMLInputElement | null> = idRef;

    if (!id) {
      key = '아이디';
    }

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

    modifyItem({ id: Number(id), name, price: Number(price) });

    idRef.current.value = '';
    nameRef.current.value = '';
    priceRef.current.value = '';
    idRef.current?.focus();
  }

  const addCartItem = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!idRef.current || !nameRef.current || !priceRef.current) return;

    const id = idRef.current?.value;
    const name = nameRef.current?.value;
    const price = priceRef.current?.value;

    let key: string | undefined;
    let ref: RefObject<HTMLInputElement | null> = idRef;

    if (!id) {
      key = '아이디';
    }

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

    addItem({ id: Number(id), name: name!, price: Number(price) });

    idRef.current.value = '';
    nameRef.current.value = '';
    priceRef.current.value = '';

    idRef.current?.focus();
  };

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
              <a href="#" onClick={()=>onClickList(id,name,price)}>
                <small>{id}.</small> {name}
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
       
      <form onSubmit={ modifying ? modifyCartItem : addCartItem } className='item-form'>
        <input type='number' ref={idRef} />
        <input type='text' ref={nameRef} />
        <input type='number' ref={priceRef} />
        <button type='reset' onClick={()=>setModifying(false)}>취소</button>
        <button type='submit'>{modifying ? "수정" : "등록"}</button>
      </form>
    </>
  );
}