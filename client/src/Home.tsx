import React, { useEffect, useRef, useContext } from "react";
import { InRoomContext, SocketContext } from "./App";
import { FormData } from "./App";

interface Home {
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Home({ data, setData, setLoggedIn }: Home) {
  const setInRoom = useContext(InRoomContext);
  const nameInputRef = useRef<HTMLInputElement>(null);

  let { socket } = useContext(SocketContext)!;

  useEffect(() => {
    nameInputRef.current!.focus();
  }, []);

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setData((prevData) => {
      return { ...prevData, [e.target.name]: e.target.value };
    });
  }

  function joinRoom(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    if (data.name && data.roomID) {
      setInRoom(true);
      socket?.emit("join", data.roomID, data.name);
    }
  }

  function handleLogout() {
    setLoggedIn(false);
    console.log(socket);
    socket?.disconnect();
  }

  return (
    <div className="border">
      <h1 className="title">Enter a Chat</h1>
      <form id="home-form">
        <div className="form-content-container">
          <label className="input-label">Name</label>
          <input
            className="form-input"
            onChange={handleFormChange}
            value={data.name}
            type="text"
            name="name"
            placeholder="Name..."
            ref={nameInputRef}
          />

          <label className="input-label">Room ID</label>
          <input
            className="form-input"
            onChange={handleFormChange}
            value={data.roomID}
            type="text"
            name="roomID"
            placeholder="Room ID..."
          />
          <div className="join-btn-container">
            <button className="join-room-btn" type="submit" onClick={joinRoom}>
              Join Room
            </button>
          </div>

          <a className="logout-link" onClick={handleLogout}>
            Logout
          </a>
        </div>
      </form>
    </div>
  );
}
