import { useState, type PropsWithChildren } from "react";
import { CounterContext } from "./CounterContext";

export function CounterProvider({children} : PropsWithChildren){
  const [count, setCount] = useState(0);
  
  const plusCount = () => setCount( count => count + 1 );

  return (
  <CounterContext.Provider value={{count, plusCount}}>
    {children}
  </CounterContext.Provider>
  );
}