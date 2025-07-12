import { useRef, type FormEvent } from "react";

type Props = {
  login: (id: number, name : string) => void;
};

const Login = ({ login }: Props) => {
  const inputIdRef = useRef<HTMLInputElement>(null);
  const inputNameRef = useRef<HTMLInputElement>(null);
  
  console.log("@@@Login");

  const submitUser = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    console.log("@@Submit")

    const id = inputIdRef.current?.value;
    const name = inputNameRef.current?.value;

    if( !id ){
      alert('아이디를 입력하세요');
      inputIdRef.current?.focus();

      return;
    }

    if( !name ){
      alert('이름을 입력하세요.');
      inputNameRef.current?.focus();

      return;
    }  

    login(+id, name);

    return;
  }

  return (
    <>
      <form action="submit" onSubmit={submitUser}>
        <div>
          Login ID(숫자): <input type="number" ref = {inputIdRef} />
        </div>
        <div>
          Login Name: <input type="text" ref = {inputNameRef} />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
