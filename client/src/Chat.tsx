import { useState } from "react";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";

interface ChatProps {
  roomID: string;
  setRoomID: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  setInRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface MessageInfo {
  message: string;
  sender: string;
  sentByMe: boolean;
}

export default function Chat({
  roomID,
  setRoomID,
  username,
  setInRoom,
}: ChatProps) {
  const [messages, setMessages] = useState<MessageInfo[]>([]);

  function addNewMessage(
    message: string,
    username: string,
    sentByMe: boolean
  ): void {
    setMessages((prevMessages) => {
      return [...prevMessages, { message, sender: username, sentByMe }];
    });
  }

  return (
    <div className="chat-container">
      <Header roomID={roomID} setRoomID={setRoomID} setInRoom={setInRoom} />
      <Body
        messages={messages}
        setMessages={setMessages}
        username={username}
        addNewMessage={addNewMessage}
      />
      <Footer
        roomID={roomID}
        addNewMessage={addNewMessage}
        username={username}
      />
    </div>
  );
}
