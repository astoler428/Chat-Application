import React from "react";
import { AccountInfo } from "./App";
import { fetchRegister } from "./apiCalls";
import { useNavigate, NavLink } from "react-router-dom";

interface RegisterProps {
  accountInfo: AccountInfo;
  setAccountInfo: React.Dispatch<React.SetStateAction<AccountInfo>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Register({
  accountInfo,
  setAccountInfo,
  setLoading,
}: RegisterProps) {
  const navigate = useNavigate();

  //controlled component to handle changes to inputs
  function handleAccountInfoChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setAccountInfo((prevAccountInfo) => {
      return { ...prevAccountInfo, [e.target.name]: e.target.value };
    });
  }

  //event listener for attempting to register
  async function handleRegister(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    //must enter all fields
    if (
      accountInfo.name === "" ||
      accountInfo.name === "" ||
      accountInfo.password === ""
    )
      return;

    setLoading(true);

    //register user on server
    const response = await fetchRegister(
      accountInfo.name!,
      accountInfo.username,
      accountInfo.password
    );
    setLoading(false);

    if (response.ok) navigate("/"); //navigate back to login
    else if (response.status == 409)
      window.alert("User already exists with this username");
    else window.alert("unknown error");
  }

  return (
    <div className="border">
      <form className="form">
        <h1 className="title">Create Account</h1>
        <input
          value={accountInfo.name}
          onChange={handleAccountInfoChange}
          name="name"
          className="form-input"
          placeholder="Name"
        />
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
        <button onClick={handleRegister} className="form-btn">
          Register
        </button>
        <p>
          Go back?{" "}
          <NavLink to="/" className="link">
            Login
          </NavLink>
        </p>
      </form>
    </div>
  );
}
