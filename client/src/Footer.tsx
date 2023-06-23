import { useState, useRef, useEffect, useContext } from "react";
// import { SocketContext } from "./App";
import { FormData, SocketContext } from "./App";

interface FooterProps {
  data: FormData;
  addNewMessage: (message: string, name: string, sentByMe: boolean) => void;
}

export default function Footer({ data, addNewMessage }: FooterProps) {
  const [message, setMessage] = useState<string>("");
  const messageInputRef = useRef<HTMLInputElement>(null);

  let { socket } = useContext(SocketContext)!;

  function sendMessage() {
    socket?.emit("message", message, data.roomID, data.name);
    addNewMessage(message, data.name, true);
    setMessage("");
  }

  function handleKeyPress(e: React.KeyboardEvent): void {
    if (e.key === "Enter" && message) sendMessage();
  }

  useEffect(() => {
    messageInputRef.current!.focus();
  }, [message]);

  return (
    <div className="footer-container">
      <input
        ref={messageInputRef}
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        className="message-input"
        placeholder="iMessage"
        onKeyDown={handleKeyPress}
      />
      {message !== "" && (
        <button onClick={sendMessage} className="send-message-btn">
          &#8593;
        </button>
      )}
    </div>
  );
}
