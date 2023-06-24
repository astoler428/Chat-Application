import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

// Protected Route Component
interface LoginRequiredProps {
  loggedIn: boolean;
}

export interface OutletContext {
  privateRoom: string;
  setPrivateRoom: React.Dispatch<React.SetStateAction<string>>;
}

export default function LoginRequired({ loggedIn }: LoginRequiredProps) {
  //I want to pass the username of the contact, so rather than boolean true/false, it's "" or a username
  const [privateRoom, setPrivateRoom] = useState<string>("");

  //Only renders outlet (pages after login) if loggedIn is true. Otherwise navigate to login
  return loggedIn ? (
    <Outlet context={{ privateRoom, setPrivateRoom }} />
  ) : (
    <Navigate to="/" />
  );
}
