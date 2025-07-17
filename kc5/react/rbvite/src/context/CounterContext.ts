import { createContext } from "react";

type ContextProps = {
  count : number;
  plusCount : () => void;
}

export const CounterContext = createContext<ContextProps>
({
  count: 0,
  plusCount : () => {},
});
