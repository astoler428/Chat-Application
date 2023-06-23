import { useContext, useEffect, useState } from "react";
import { InRoomContext, SocketContext } from "./App";
import { FormData } from "./App";

interface HeaderProps {
  data: FormData;
}

export default function Header({ data }: HeaderProps) {
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
    socket?.emit("leave", data.roomID);
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
      <div>Room ID: {data.roomID}</div>
      <div>Members: {roomMembersToDisplay}</div>
      <button onClick={handleLeaveRoom} className="leave-chat-btn">
        &lt;
      </button>
    </div>
  );
}
