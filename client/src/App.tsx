import React, { useState, createContext } from "react";
import Chat from "./Chat";
import Home from "./Home";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import Contacts from "./Contacts";
import ForgotPassword from "./ForgotPassword";
import { Socket } from "socket.io-client";

interface ISocketContext {
  socket: Socket | undefined;
  setSocket: React.Dispatch<React.SetStateAction<Socket | undefined>>;
}

interface Message {
  roomID: string;
  sender: string;
  message: string;
  date: number;
}
// (Message[] | React.Dispatch<React.SetStateAction<Message[]>>)[]
export const MessageHistoryContext = createContext<
  [Message[], React.Dispatch<React.SetStateAction<Message[]>>] | undefined
>(undefined);

export const SocketContext = createContext<ISocketContext | undefined>(
  undefined
);

export const InRoomContext = createContext<
  React.Dispatch<React.SetStateAction<boolean>>
>(() => {});

export interface AccountInfo {
  name?: string;
  username: string;
  password: string;
}

function App() {
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [register, setRegister] = useState<boolean>(false);
  const [inContacts, setInContacts] = useState<boolean>(false);
  const [inRoom, setInRoom] = useState<boolean>(false);
  const [roomID, setRoomID] = useState<string>("");
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    name: "",
    username: "",
    password: "",
  });
  // [messageHistory, setMessageHistory];
  return (
    <MessageHistoryContext.Provider value={[messageHistory, setMessageHistory]}>
      <SocketContext.Provider value={{ socket, setSocket }}>
        {!loggedIn ? (
          register ? (
            <Register
              accountInfo={accountInfo}
              setAccountInfo={setAccountInfo}
              setRegister={setRegister}
            />
          ) : forgotPassword ? (
            <ForgotPassword setForgotPassword={setForgotPassword} />
          ) : (
            <Login
              accountInfo={accountInfo}
              setAccountInfo={setAccountInfo}
              setRegister={setRegister}
              setLoggedIn={setLoggedIn}
              setForgotPassword={setForgotPassword}
            />
          )
        ) : (
          <InRoomContext.Provider value={setInRoom}>
            {inRoom ? (
              <Chat
                roomID={roomID}
                setRoomID={setRoomID}
                username={accountInfo.username}
              />
            ) : inContacts ? (
              <Contacts
                username={accountInfo.username}
                roomID={roomID}
                setRoomID={setRoomID}
                setInContacts={setInContacts}
              />
            ) : (
              <Home
                roomID={roomID}
                setRoomID={setRoomID}
                setLoggedIn={setLoggedIn}
                username={accountInfo.username}
                setInContacts={setInContacts}
              />
            )}
          </InRoomContext.Provider>
        )}
      </SocketContext.Provider>
    </MessageHistoryContext.Provider>
  );
}

export default App;
