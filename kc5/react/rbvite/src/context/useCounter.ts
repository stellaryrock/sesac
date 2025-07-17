import { useContext } from "react";
import { CounterContext } from "./CounterContext";

export const useCounter = () => useContext(CounterContext);