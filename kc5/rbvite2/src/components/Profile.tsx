// src/components/Profile.tsx
import type { LoginUser } from '../App';

type Props = {
  loginUser: LoginUser;
  logout: () => void;
};

const Profile = ({ loginUser, logout }: Props) => {
  console.log('@@@Profile');
  return (
    <>
      <div>User Name: {loginUser.name}</div>
      <button onClick={logout}>Logout</button>
    </>
  );
};
export default Profile;