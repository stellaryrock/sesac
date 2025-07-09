import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

// function useState(initValue){
//   const obj = {
//     _x : initValue,

//     get x() {
//       return this._x;
//     },
//
//     setX(newValue){
//       this._x = newValue;
//     }
//   }

//   return [obj.x, obj.setX];
// }

const AboutMe = ({ myinfo }) => {
  const { name, hobbies } = myinfo;
  return (
    <>
      <h2>{name}</h2>
      <div>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {hobbies.map((hobby) => (
            <li key={hobby}>{hobby}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

function MyButton({ onClick }) {
  return (
    <button
      className="bg-blue-300 rounded text-white hover:bg-blue-500 mb-5"
      onClick={onClick}
    >
      MyButton
    </button>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const hong = { name: "Hong", hobbies: ["Bike", "Tennis"] };

  let x = 100;
  const str = `${x}`;

  const plusCount = () => {
    setCount((count) => count + 1);
    console.log(`count : ${count}`);

    console.log(`before add 1 x : ${x}`);
    x = x + 1;
    console.log(`after add 1 x : ${x}`);
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5">
      <h1 className="text-3xl"> Vite + React {19} </h1>
      <MyButton onClick={() => setIsLoggedIn(!isLoggedIn)} />
      {isLoggedIn ? <AboutMe myinfo={hong} /> : <h3>Login Form</h3>}
    </div>
  );
}

export default App;
