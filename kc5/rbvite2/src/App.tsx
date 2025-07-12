import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SignatureKind } from 'typescript';
import Profile from './components/Profile';
import My from './components/My';

export type LoginUser = { id: number; name: string };
export type Cart = { id: number; name: string; price: number };
export type Session = {
  loginUser: LoginUser | null;
  cart: Cart[];
};


const SampleSession = {
  //loginUser: null,
  loginUser: { id: 1, name: 'Hong' },
  cart: [{ id: 100, name: '라면', price: 3000 }, { id: 101, name: '컵라면', price: 2000 }, { id: 200, name: '파', price: 5000 }],
};



function App() {
  const [count, setCount] = useState<number>(0);
  const [session, setSession] = useState<Session>(SampleSession);

  const login = (id :number ,name : string)  => setSession({...session , loginUser: {id, name} });
  const logout = () => {};

  return (
    <>
      <My session={session} login={login} logout={logout} />
      {session.loginUser ? <button onClick={()=>{login(2, 'Kim')} }>LoginUser: {session.loginUser?.name}</button> 
                         : <Profile logout = {logout} username = {session.loginUser?.name} ></Profile>}
      <button id='xxx' onClick={() => setCount((count) => count + 1)}>
        count is {count};
      </button>
      <ul>
        {session.cart.map(({id, name, price}) => <li key={id}> {name} <small>({price.toLocaleString()})</small></li>)}
      </ul>
    </>
  );
}

export default App
