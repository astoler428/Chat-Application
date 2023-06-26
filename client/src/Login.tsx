import { AccountInfo, SocketContext } from "./App";
import { io } from "socket.io-client";
import { useContext } from "react";
import { fetchLogin } from "./apiCalls";
import { useNavigate, NavLink } from "react-router-dom";
import { PORT_URL } from "./apiCalls";

interface LoginProps {
  accountInfo: AccountInfo;
  setAccountInfo: React.Dispatch<React.SetStateAction<AccountInfo>>;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Login({
  accountInfo,
  setAccountInfo,
  setLoggedIn,
  setLoading,
}: LoginProps) {
  const { setSocket } = useContext(SocketContext)!;
  const navigate = useNavigate();

  function handleAccountInfoChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setAccountInfo((prevAccountInfo) => {
      return { ...prevAccountInfo, [e.target.name]: e.target.value };
    });
  }

  //event listener for attempting to login
  async function handleLogin(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    //must enter fields
    if (accountInfo.username === "" || accountInfo.password === "") return;

    setLoading(true);
    //verify user in database
    const response = await fetchLogin(
      accountInfo.username,
      accountInfo.password
    );
    setLoading(false);
    //if valid
    if (response.ok) {
      setSocket(io(PORT_URL)); //open socket

      setLoggedIn(true);
      navigate("/home");
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
        <NavLink to="/forgotpassword" className="link">
          Forgot Password?
        </NavLink>
        <p>
          Don't have an account?{" "}
          <NavLink to="/register" className="link">
            Register
          </NavLink>
        </p>
      </form>
    </div>
  );
}
``;
