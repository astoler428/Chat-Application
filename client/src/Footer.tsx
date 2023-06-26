import { useState, useRef, useEffect, useContext } from "react";
import { SocketContext } from "./App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowUp } from "@fortawesome/free-solid-svg-icons";

interface FooterProps {
  roomID: string;
  addNewMessage: (
    roomID: string,
    sender: string,
    message: string,
    date: number
  ) => void;
  username: string;
}

export default function Footer({
  roomID,
  addNewMessage,
  username,
}: FooterProps) {
  const [message, setMessage] = useState<string>(""); //controlled input for typing message
  const messageInputRef = useRef<HTMLInputElement>(null);
  let { socket } = useContext(SocketContext)!;

  //keep focus on input after message sends
  useEffect(() => {
    messageInputRef.current!.focus();
  }, [message]);

  function sendMessage() {
    socket?.emit("message", message, roomID, username); //send message to server
    addNewMessage(roomID, username, message, Date.now()); //add message to state variable in Chat
    setMessage(""); //clear input
  }

  //allows messages to be sent with Enter key
  function handleKeyPress(e: React.KeyboardEvent): void {
    if (e.key === "Enter" && message) sendMessage();
  }

  return (
    <div className="footer-container">
      <input
        ref={messageInputRef}
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        className="message-input"
        placeholder="message"
        onKeyDown={handleKeyPress}
      />
      {message !== "" && (
        <FontAwesomeIcon
          icon={faCircleArrowUp}
          style={{ color: "#0051ff" }}
          onClick={sendMessage}
          className="send-message-icon"
        />
      )}
    </div>
  );
}
