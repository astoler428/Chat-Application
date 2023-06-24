import { useContext, useEffect, useState } from "react";
import { InRoomContext, SocketContext } from "./App";

interface HeaderProps {
  roomID: string;
  setRoomID: React.Dispatch<React.SetStateAction<string>>;
}

export default function Header({ roomID, setRoomID }: HeaderProps) {
  const setInRoom = useContext(InRoomContext);
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
    <div className="header-container">
      <div>Room ID: {roomID}</div>
      <div>Members: {roomMembersToDisplay}</div>
      <button onClick={handleLeaveRoom} className="leave-chat-btn">
        &lt;
      </button>
    </div>
  );
}
