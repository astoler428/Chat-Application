import { useState, useRef, useEffect, useContext } from "react";
// import { SocketContext } from "./App";
import { SocketContext } from "./App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowUp } from "@fortawesome/free-solid-svg-icons";

interface FooterProps {
  roomID: string;
  addNewMessage: (message: string, name: string, sentByMe: boolean) => void;
  username: string;
}

export default function Footer({
  roomID,
  addNewMessage,
  username,
}: FooterProps) {
  const [message, setMessage] = useState<string>("");
  const messageInputRef = useRef<HTMLInputElement>(null);

  let { socket } = useContext(SocketContext)!;

  function sendMessage() {
    socket?.emit("message", message, roomID, username);
    addNewMessage(message, username, true);
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
        <FontAwesomeIcon
          icon={faCircleArrowUp}
          style={{ color: "#0051ff" }}
          onClick={sendMessage}
          className="send-message-icon"
        />
        // <button onClick={sendMessage} className="send-message-btn">
        //   &#8593;
        // </button>
      )}
    </div>
  );
}
