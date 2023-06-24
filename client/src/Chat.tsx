import { useState, useEffect, useContext } from "react";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
import { SocketContext } from "./App";

//Component that displays the chat - broken into three smaller components
//header, body and footer

interface ChatProps {
  roomID: string;
  setRoomID: React.Dispatch<React.SetStateAction<string>>;
  username: string;
}

export interface MessageType {
  roomID: string;
  sender: string;
  message: string;
  date: number;
}

export default function Chat({ roomID, setRoomID, username }: ChatProps) {
  const [messages, setMessages] = useState<MessageType[]>([]); //list of all messages
  const { socket } = useContext(SocketContext)!;

  useEffect(() => {
    //receive messages sent to the chat
    socket?.on("message", (message, name) =>
      addNewMessage(roomID, name, message, Date.now())
    );
  }, [socket]);

  //add a message by updating the message state array
  function addNewMessage(
    roomID: string,
    sender: string,
    message: string,
    date: number
  ): void {
    setMessages((prevMessages) => {
      return [...prevMessages, { roomID, sender, message, date }];
    });
  }

  return (
    <div className="chat-container">
      <Header roomID={roomID} setRoomID={setRoomID} />
      <Body
        messages={messages}
        setMessages={setMessages}
        username={username}
        roomID={roomID}
      />
      <Footer
        roomID={roomID}
        addNewMessage={addNewMessage}
        username={username}
      />
    </div>
  );
}
