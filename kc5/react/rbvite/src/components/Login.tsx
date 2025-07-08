type Props = {
  login: () => void;
};

const Login = ({ login }: Props) => {
  console.log('@@@Login');
  
  return (
    <>
      <div>Login ID(숫자): <input type='number' /></div>
      <div>Login Name: <input type='text' /></div>
      <button onClick={login}>Login</button>
    </>
  );
};

export default Login;