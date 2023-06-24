import { useEffect } from "react";
import { MessageType } from "./Chat";
import ScrollToBottom from "react-scroll-to-bottom";
import { fetchMessageHistory } from "./apiCalls";
import Message from "./Message";

interface BodyProps {
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  username: string;
  roomID: string;
}

export default function Body({
  messages,
  setMessages,
  username,
  roomID,
}: BodyProps) {
  //display messages in the body
  useEffect(() => {
    displayMessages();

    async function displayMessages() {
      const res = await fetchMessageHistory(roomID); //fetch messageHistory from server
      let oldMessages: MessageType[] = await res.json();
      oldMessages.sort((a, b) => a.date - b.date); //sort in chronological order
      setMessages(oldMessages);
    }
  }, []);

  //turn each messageObj into a Message component
  const messagesToDislay = messages.map((messageObj) => {
    return (
      <Message
        key={Math.random()}
        content={messageObj.message}
        msgSender={messageObj.sender}
        sentByMe={messageObj.sender === username}
      />
    );
  });

  return (
    <div className="body-container scroll-container">
      <ScrollToBottom className="scroll-container">
        {messagesToDislay}
      </ScrollToBottom>
    </div>
  );
}
