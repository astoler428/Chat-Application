import { useState } from "react";
import { fetchChangePassword } from "./apiCalls";
import { useNavigate, NavLink } from "react-router-dom";

interface PasswordChangeInfo {
  username: string;
  password: string;
}

export default function ForgotPassword() {
  const navigate = useNavigate();

  //state for input values
  const [passwordChangeInfo, setPasswordChangeInfo] =
    useState<PasswordChangeInfo>({
      username: "",
      password: "",
    });

  //event handle to control inputs
  function handlePasswordInfoChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setPasswordChangeInfo((prevInfo) => {
      return { ...prevInfo, [e.target.name]: e.target.value };
    });
  }

  //event listener when new password submitted
  async function handlePasswordChange(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    //must fill out all fields
    if (
      passwordChangeInfo.username === "" ||
      passwordChangeInfo.password === ""
    )
      return;

    //change password on server
    const response = await fetchChangePassword(
      passwordChangeInfo.username,
      passwordChangeInfo.password
    );

    if (response.status == 200) {
      navigate("/");
    } else if (response.status == 204)
      window.alert("A user with that username does not exist");
    else if (response.status == 400) window.alert("Missing Field Required");
    else window.alert("unknown error");
  }

  return (
    <div className="border">
      <form className="form">
        <h1 className="title">Reset Password</h1>
        <input
          value={passwordChangeInfo.username}
          onChange={handlePasswordInfoChange}
          name="username"
          className="form-input"
          placeholder="Username"
        />
        <input
          value={passwordChangeInfo.password}
          onChange={handlePasswordInfoChange}
          name="password"
          className="form-input"
          type="password"
          placeholder="New Password..."
        />

        <button
          type="submit"
          onClick={handlePasswordChange}
          className="form-btn"
        >
          Submit
        </button>
        <p>
          <NavLink to="/" className="link">
            Back to Login
          </NavLink>
        </p>
      </form>
    </div>
  );
}
