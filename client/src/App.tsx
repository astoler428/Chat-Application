import React, { useState, createContext } from "react";
import Chat from "./Chat";
import Home from "./Home";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import { Socket } from "socket.io-client";

interface ISocketContext {
  socket: Socket | undefined;
  setSocket: React.Dispatch<React.SetStateAction<Socket | undefined>>;
}

export const SocketContext = createContext<ISocketContext | undefined>(
  undefined
);

export const InRoomContext = createContext<
  React.Dispatch<React.SetStateAction<boolean>>
>(() => {});

export type FormData = {
  name: string;
  roomID: string;
};

export type AccountInfo = {
  name?: string;
  username: string;
  password: string;
};

function App() {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [register, setRegister] = useState<boolean>(false);
  const [inRoom, setInRoom] = useState<boolean>(false);
  const [data, setData] = useState<FormData>({ name: "", roomID: "" });
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    name: "",
    username: "",
    password: "",
  });

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {!loggedIn ? (
        !register ? (
          <Login
            accountInfo={accountInfo}
            setAccountInfo={setAccountInfo}
            setRegister={setRegister}
            setLoggedIn={setLoggedIn}
          />
        ) : (
          <Register
            accountInfo={accountInfo}
            setAccountInfo={setAccountInfo}
            setRegister={setRegister}
          />
        )
      ) : (
        <InRoomContext.Provider value={setInRoom}>
          {inRoom ? (
            <Chat data={data} />
          ) : (
            <Home data={data} setData={setData} setLoggedIn={setLoggedIn} />
          )}
        </InRoomContext.Provider>
      )}
    </SocketContext.Provider>
  );
}

export default App;
