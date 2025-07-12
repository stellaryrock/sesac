import type { Session } from '../App';
import Login from './Login';
import Profile from './Profile';

type Props = {
  session: Session;
  login: (id:number, name: string) => void;
  logout: () => void;
};

const My = ({ session: { loginUser, cart }, 
    login, logout }: Props) => {
  console.log('@@@My');
  return (
    <>
      {loginUser ? (
        <Profile loginUser={loginUser} logout={logout} />
      ) : (
        <Login login={login} />
      )}
      <ul>
        {cart.map(({ id, name, price }) => (
          <li key={id}>
            {name}({price})
          </li>
        ))}
      </ul>
    </>
  );
};
export default My;
