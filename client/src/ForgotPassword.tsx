import { AccountInfo, SocketContext } from "./App";
import { io } from "socket.io-client";
import { useContext, useState } from "react";
import { fetchChangePassword, fetchLogin } from "./apiCalls";

interface PasswordChangeInfo {
  username: string;
  password: string;
}

interface ForgotPasswordProps {
  setForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ForgotPassword({
  setForgotPassword,
}: ForgotPasswordProps) {
  const [passwordChangeInfo, setPasswordChangeInfo] =
    useState<PasswordChangeInfo>({
      username: "",
      password: "",
    });

  function handlePasswordInfoChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setPasswordChangeInfo((prevInfo) => {
      return { ...prevInfo, [e.target.name]: e.target.value };
    });
  }

  async function handlePasswordChange(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (
      passwordChangeInfo.username === "" ||
      passwordChangeInfo.password === ""
    )
      return;

    const response = await fetchChangePassword(
      passwordChangeInfo.username,
      passwordChangeInfo.password
    );
    console.log(response.status);
    if (response.status == 200) {
      setForgotPassword(false);
    } else if (response.status == 204)
      window.alert("A user with that username does not exist");
    else if (response.status == 400) window.alert("Missing Field Required");
    else window.alert("unknown error");
  }

  return (
    <div className="border">
      <form className="login-container">
        <h1 className="login-title">Reset Password</h1>
        <input
          value={passwordChangeInfo.username}
          onChange={handlePasswordInfoChange}
          name="username"
          className="login-input"
          placeholder="Username"
        />
        <input
          value={passwordChangeInfo.password}
          onChange={handlePasswordInfoChange}
          name="password"
          className="login-input"
          type="password"
          placeholder="New Password..."
        />

        <button
          type="submit"
          onClick={handlePasswordChange}
          className="login-page-btn"
        >
          Submit
        </button>
      </form>
      <p>
        <a
          className="forgot-password-link"
          onClick={() => setForgotPassword(false)}
        >
          Back to Login
        </a>
      </p>
    </div>
  );
}
