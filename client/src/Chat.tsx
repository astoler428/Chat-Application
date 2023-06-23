import { useState } from "react";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
import { FormData } from "./App";

interface ChatProps {
  data: FormData;
}

export interface MessageInfo {
  message: string;
  sender: string;
  sentByMe: boolean;
}

export default function Chat({ data }: ChatProps) {
  const [messages, setMessages] = useState<MessageInfo[]>([]);

  function addNewMessage(
    message: string,
    name: string,
    sentByMe: boolean
  ): void {
    setMessages((prevMessages) => {
      return [...prevMessages, { message, sender: name, sentByMe }];
    });
  }

  return (
    <div className="chat-container">
      <Header data={data} />
      <Body messages={messages} addNewMessage={addNewMessage} />
      <Footer data={data} addNewMessage={addNewMessage} />
    </div>
  );
}
