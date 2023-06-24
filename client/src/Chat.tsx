import { useState } from "react";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";

interface ChatProps {
  roomID: string;
  setRoomID: React.Dispatch<React.SetStateAction<string>>;
  username: string;
}

export interface MessageInfo {
  message: string;
  sender: string;
  sentByMe: boolean;
}

export default function Chat({ roomID, setRoomID, username }: ChatProps) {
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
      <Header roomID={roomID} setRoomID={setRoomID} />
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
