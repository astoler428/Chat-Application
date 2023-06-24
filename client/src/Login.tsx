import { AccountInfo, SocketContext } from "./App";
import { io } from "socket.io-client";
import { useContext } from "react";
import { fetchLogin } from "./apiCalls";

interface LoginProps {
  setRegister: React.Dispatch<React.SetStateAction<boolean>>;
  accountInfo: AccountInfo;
  setAccountInfo: React.Dispatch<React.SetStateAction<AccountInfo>>;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Login({
  setRegister,
  accountInfo,
  setAccountInfo,
  setLoggedIn,
  setForgotPassword,
}: LoginProps) {
  const { setSocket } = useContext(SocketContext)!;

  function handleAccountInfoChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setAccountInfo((prevAccountInfo) => {
      return { ...prevAccountInfo, [e.target.name]: e.target.value };
    });
  }

  async function handleLogin(e: React.MouseEvent<HTMLButtonElement>) {
    //later check for accuracy
    e.preventDefault();
    if (accountInfo.username === "" || accountInfo.password === "") return;
    const response = await fetchLogin(
      accountInfo.username,
      accountInfo.password
    );

    if (response.ok) {
      setSocket(io("http://localhost:3000"));
      setLoggedIn(true);
    } else if (response.status == 404)
      window.alert("No user exists with that username");
    else if (response.status == 400) window.alert("Incorrect password");
    else window.alert("unknown error");
  }

  return (
    <div className="border">
      <form className="form">
        <h1 className="title">Login</h1>
        <input
          value={accountInfo.username}
          onChange={handleAccountInfoChange}
          name="username"
          className="form-input"
          placeholder="Username"
        />
        <input
          value={accountInfo.password}
          onChange={handleAccountInfoChange}
          name="password"
          className="form-input"
          type="password"
          placeholder="Password"
        />

        <button onClick={handleLogin} className="form-btn">
          Login
        </button>
        <a className="link" onClick={() => setForgotPassword(true)}>
          Forgot Password?
        </a>
        <p>
          Don't have an account?{" "}
          <a className="link" onClick={() => setRegister(true)}>
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
