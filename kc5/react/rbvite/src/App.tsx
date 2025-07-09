import { useState } from "react";
import "./App.css";

import My from "./components/My";

export type LoginUser = { id: number; name: string };
export type Cart = { id: number; name: string; price: number };
export type Session = {
  loginUser: LoginUser | null;
  cart: Cart[];
};

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

  const login = () => {};
  const logout = () => {
    setSession({ loginUser: null, cart: [] });
  };

  return (
    <>
      <My session={session} login={login} logout={logout} />
    </>
  );
}

export default App;
