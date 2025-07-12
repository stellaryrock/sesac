import { useRef } from "react";

// src/components/Login.tsx
type Props = {
  login: (id: number, name: string) => void;
};

const Login = ({ login }: Props) => {
  console.log('@@@Login');

  const onLogin = () => {

    const id = idRef.current?.value;
    const name = idRef.current?.value;

    if(!id){
      alert('아이디를 입려하세요.');
      idRef.current?.focus();

      return;
    }

    if(!name){
      alert('이름을 입력하세요.');
      nameRef.current?.focus();

      return;
    }

    login(Number(id), name);
  };

  const idRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div>Login ID(숫자): <input type='number' ref={idRef} /></div>
      <div>Login Name: <input type='text' ref={nameRef} /></div>
      <button onClick={()=>onLogin()}>Login</button>
    </>
  );
};
export default Login;