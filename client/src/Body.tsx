import { useEffect, useContext } from "react";
import Message from "./Message";
// import { socket } from "./App";
import { MessageInfo } from "./Chat";
import ScrollToBottom from "react-scroll-to-bottom";
import { MessageHistoryContext, SocketContext } from "./App";

interface BodyProps {
  messages: MessageInfo[];
  setMessages: React.Dispatch<React.SetStateAction<MessageInfo[]>>;
  username: string;
  addNewMessage: (message: string, name: string, sentByMe: boolean) => void;
}

export default function Body({
  messages,
  setMessages,
  username,
  addNewMessage,
}: BodyProps) {
  const { socket } = useContext(SocketContext)!;
  const [messageHistory, setMessageHistory] = useContext(
    MessageHistoryContext
  )!;

  useEffect(() => {
    socket?.on("message", (message, name) =>
      addNewMessage(message, name, false)
    );
  }, [socket]);

  useEffect(() => {
    let oldMessages = [...messageHistory];
    oldMessages.sort((a, b) => a.date - b.date);
    const theOldMessages = oldMessages.map((messageObj) => {
      return {
        message: messageObj.message,
        sender: messageObj.sender,
        sentByMe: messageObj.sender === username,
      };
    });
    setMessages(theOldMessages);
  }, [messageHistory]);

  const messagesToDislay = messages.map((messageObj) => (
    <Message
      key={Math.random()}
      content={messageObj.message}
      msgSender={messageObj.sender}
      sentByMe={messageObj.sentByMe}
    />
  ));

  return (
    <div className="body-container scroll-container">
      <ScrollToBottom className="scroll-container">
        {messagesToDislay}
      </ScrollToBottom>
    </div>
  );
  // return (
  //   <div className="body-container">
  //     <Message content="Hey Ari," msgSender="Jeff" sentByMe={false} />
  //     <Message content="Hey Jeng cool?" msgSender="Ari" sentByMe={true} />{" "}
  //   </div>
  // );
}

{
  /* <Message
        content="Hey Ari, what are you up to?"
        msgSender="Jeff"
        sentByMe={false}
      />
      <Message
        content="Hey Jeff, I'm good. How was your weekend. Did you do anything cool?"
        msgSender="Ari"
        sentByMe={true}
      /> */
}
