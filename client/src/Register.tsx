import React from "react";
import { AccountInfo } from "./App";
import { fetchRegister } from "./apiCalls";

interface RegisterProps {
  setRegister: React.Dispatch<React.SetStateAction<boolean>>;
  accountInfo: AccountInfo;
  setAccountInfo: React.Dispatch<React.SetStateAction<AccountInfo>>;
}

export default function Register({
  setRegister,
  accountInfo,
  setAccountInfo,
}: RegisterProps) {
  function handleAccountInfoChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setAccountInfo((prevAccountInfo) => {
      return { ...prevAccountInfo, [e.target.name]: e.target.value };
    });
  }

  async function handleRegister(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (
      accountInfo.name === "" ||
      accountInfo.name === "" ||
      accountInfo.password === ""
    )
      return;
    const response = await fetchRegister(
      accountInfo.name!,
      accountInfo.username,
      accountInfo.password
    );

    if (response.ok) setRegister(false);
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
          <a className="link" onClick={() => setRegister(false)}>
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
