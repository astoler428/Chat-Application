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
import { fetchWakeUpWebService } from "./apiCalls";

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
  const [loggedIn, setLoggedIn] = useState<boolean>(false); //used to protect routes
  const [socket, setSocket] = useState<Socket | undefined>(undefined); //passed through context
  const [roomID, setRoomID] = useState<string>(""); //id of socket.io room user joins
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    name: "",
    username: "",
    password: "",
  }); //login & register info

  setInterval(async function () {
    await fetchWakeUpWebService();
  }, 800000);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      <Routes>
        <Route
          path="/"
          element={
            <Login
              accountInfo={accountInfo}
              setAccountInfo={setAccountInfo}
              setLoggedIn={setLoggedIn}
            />
          }
        />
        <Route
          path="/register"
          element={
            <Register
              accountInfo={accountInfo}
              setAccountInfo={setAccountInfo}
            />
          }
        />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
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
