import { useContext, useEffect, useState } from "react";
import { SocketContext } from "./App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";

interface HeaderProps {
  roomID: string;
  setRoomID: React.Dispatch<React.SetStateAction<string>>;
  setInRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ roomID, setRoomID, setInRoom }: HeaderProps) {
  const [roomMembers, setRoomMembers] = useState<(string | undefined)[]>([]);

  let { socket } = useContext(SocketContext)!;

  useEffect(() => {
    socket?.on("room-members", (currentRoomMembers) => {
      setRoomMembers(currentRoomMembers);
    });
  }, [socket]);

  function handleLeaveRoom() {
    setInRoom!(false);
    setRoomID("");
    socket?.emit("leave", roomID);
  }

  const roomMembersToDisplay = roomMembers.map((roomMember, index) => {
    return (
      <span key={index}>
        {roomMember + (index === roomMembers.length - 1 ? "" : ", ")}
      </span>
    );
  });
  return (
    <>
      <div className="header-container">
        <div>Room ID: {roomID}</div>
        <div>Members: {roomMembersToDisplay}</div>
        <FontAwesomeIcon
          className="back-icon"
          icon={faAnglesLeft}
          style={{ color: "#0051ff" }}
          onClick={handleLeaveRoom}
        />
        {/* 
        <button onClick={handleLeaveRoom} className="leave-chat-btn">
          &lt;
        </button> */}
      </div>
    </>
  );
}
