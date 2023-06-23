import { AccountInfo, SocketContext } from "./App";
import { io } from "socket.io-client";
import { useContext } from "react";

const PORT_URL = "http://localhost:3000";

interface LoginProps {
  setRegister: React.Dispatch<React.SetStateAction<boolean>>;
  accountInfo: AccountInfo;
  setAccountInfo: React.Dispatch<React.SetStateAction<AccountInfo>>;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Login({
  setRegister,
  accountInfo,
  setAccountInfo,
  setLoggedIn,
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
    const response = await fetch(`${PORT_URL}/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        username: accountInfo.username,
        password: accountInfo.password,
      }),
    });

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
      <form className="login-container">
        <h1 className="login-title">Login</h1>
        <input
          value={accountInfo.username}
          onChange={handleAccountInfoChange}
          name="username"
          className="login-input"
          placeholder="Username"
        />
        <input
          value={accountInfo.password}
          onChange={handleAccountInfoChange}
          name="password"
          className="login-input"
          type="password"
          placeholder="Password"
        />

        <button onClick={handleLogin} className="login-page-btn">
          Login
        </button>

        <p>
          Don't have an account?{" "}
          <a className="login-link" onClick={() => setRegister(true)}>
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
