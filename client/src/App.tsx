import React, { useState, createContext } from "react";
import Chat from "./Chat";
import Home from "./Home";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import Contacts from "./Contacts";
import ForgotPassword from "./ForgotPassword";
import { Socket } from "socket.io-client";
import { Route, Routes } from "react-router-dom";
import LoginRequired from "./LoginRequired";
import Loading from "./Loading";

interface ISocketContext {
  socket: Socket | undefined;
  setSocket: React.Dispatch<React.SetStateAction<Socket | undefined>>;
}

export interface AccountInfo {
  name?: string;
  username: string;
  password: string;
}

export const SocketContext = createContext<ISocketContext | undefined>(
  undefined
);

function App() {
  const [loading, setLoading] = useState<boolean>(false); //used to display loading during API call
  const [loggedIn, setLoggedIn] = useState<boolean>(false); //used to protect routes
  const [socket, setSocket] = useState<Socket | undefined>(undefined); //passed through context
  const [roomID, setRoomID] = useState<string>(""); //id of socket.io room user joins
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    name: "",
    username: "",
    password: "",
  }); //login & register info

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      <Routes>
        <Route
          path="/"
          element={
            loading ? (
              <Loading />
            ) : (
              <Login
                accountInfo={accountInfo}
                setAccountInfo={setAccountInfo}
                setLoggedIn={setLoggedIn}
                setLoading={setLoading}
              />
            )
          }
        />
        <Route
          path="/register"
          element={
            loading ? (
              <Loading />
            ) : (
              <Register
                accountInfo={accountInfo}
                setAccountInfo={setAccountInfo}
                setLoading={setLoading}
              />
            )
          }
        />
        <Route
          path="/forgotpassword"
          element={
            loading ? <Loading /> : <ForgotPassword setLoading={setLoading} />
          }
        />
        <Route element={<LoginRequired loggedIn={loggedIn} />}>
          <Route
            path="/home"
            element={
              <Home
                roomID={roomID}
                setRoomID={setRoomID}
                username={accountInfo.username}
                setLoggedIn={setLoggedIn}
              />
            }
          />
          <Route
            path="/contacts"
            element={
              <Contacts
                username={accountInfo.username}
                roomID={roomID}
                setRoomID={setRoomID}
              />
            }
          />
          <Route
            path="/chat"
            element={
              <Chat
                roomID={roomID}
                setRoomID={setRoomID}
                username={accountInfo.username}
              />
            }
          />
        </Route>
      </Routes>
    </SocketContext.Provider>
  );
}

export default App;
