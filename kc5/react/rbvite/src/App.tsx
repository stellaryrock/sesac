import { useState } from "react";
import "./App.css";

import My from "./components/My";

export type LoginUser = { id: number; name: string };
export type Cart = { id: number; name: string; price: number };
export type Session = {
  loginUser: LoginUser | null;
  cart: Cart[];
};

export type LoginFn = (id: number, name: string) => void;

const SampleSession: Session = {
  loginUser: { id: 1, name: "hong" },
  cart: [
    { id: 100, name: "라면", price: 2000 },
    { id: 101, name: "컵라면", price: 2000 },
    { id: 200, name: "파", price: 5000 },
  ],
};


function App() {
  const [session, setSession] = useState<Session>(SampleSession);

  const login = (id: number, name : string) => setSession({...session , loginUser : {id, name}});
  const logout = () => setSession({ loginUser: null, cart: [] });

  const removeItem = (id: number) => setSession({...session, cart: [...session.cart.filter(item => item.id !== id)]});
  const addItem = (name: string, price : number) => setSession({...session, cart : [...session.cart, {id: session.cart.length, name, price}]});
  const editItem = (item : Cart) => setSession({...session, cart : session.cart.map(cart => cart.id === item.id ? item : cart )});

  return (
    <>
      <My session={session} login={login} logout={logout} removeItem={removeItem} addItem = {addItem} editItem={editItem} />
    </>
  );
}

export default App;
