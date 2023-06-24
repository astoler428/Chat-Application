import { useContext, useEffect, useState } from "react";
import { SocketContext } from "./App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useOutletContext } from "react-router-dom";
import { OutletContext } from "./LoginRequired";

//top portion of the chat that includes the room info and back button

interface HeaderProps {
  roomID: string;
  setRoomID: React.Dispatch<React.SetStateAction<string>>;
}

export default function Header({ roomID, setRoomID }: HeaderProps) {
  const navigate = useNavigate();
  let { socket } = useContext(SocketContext)!;
  const { privateRoom }: OutletContext = useOutletContext();
  const [roomMembers, setRoomMembers] = useState<(string | undefined)[]>([]);

  useEffect(() => {
    //listens for a change to the room members
    socket?.on("room-members", (currentRoomMembers) => {
      setRoomMembers(currentRoomMembers);
    });
  }, [socket]);

  function handleLeaveRoom() {
    setRoomID("");
    socket?.emit("leave", roomID);
    navigate(-1);
  }

  //display room members in a list separated by a comma
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
        <div>
          {privateRoom === ""
            ? `Room ID: ${roomID}`
            : `Private chat with ${privateRoom}`}
        </div>
        <div>Members: {roomMembersToDisplay}</div>
        <FontAwesomeIcon
          className="back-icon"
          icon={faAnglesLeft}
          style={{ color: "#0051ff" }}
          onClick={handleLeaveRoom}
        />
      </div>
    </>
  );
}
