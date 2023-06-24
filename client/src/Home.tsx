import React, { useEffect, useRef, useContext } from "react";
import { SocketContext, MessageHistoryContext } from "./App";
import { fetchMessageHistory, fetchDeleteUser } from "./apiCalls";
interface Home {
  roomID: string;
  setRoomID: React.Dispatch<React.SetStateAction<string>>;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
  setInContacts: React.Dispatch<React.SetStateAction<boolean>>;
  setInRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Home({
  roomID,
  setRoomID,
  setLoggedIn,
  username,
  setInContacts,
  setInRoom,
}: Home) {
  const [messageHistory, setMessageHistory] = useContext(
    MessageHistoryContext
  )!;

  const roomInputRef = useRef<HTMLInputElement>(null);

  let { socket } = useContext(SocketContext)!;

  socket?.on("connect", () => {
    socket?.emit("store-username", username);
  });

  useEffect(() => {
    roomInputRef.current!.focus();
  }, []);

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setRoomID(e.target.value);
  }

  async function joinRoom(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (roomID) {
      setInRoom(true);
      socket?.emit("join", roomID);

      //fetch and set history
      const response = await fetchMessageHistory(roomID);
      const oldMessages = await response.json();
      setMessageHistory(oldMessages);
    }
  }

  function handleLogout() {
    setLoggedIn(false);
    socket?.disconnect();
  }

  async function handleDeleteAccount() {
    const response = await fetchDeleteUser(username);
    const done = await response.json();
    console.log(done);

    handleLogout();
  }

  return (
    <>
      <div className="border">
        <form className="form">
          <h1 className="black title">Enter a Chat</h1>
          <label className="input-label">Room ID</label>
          <input
            className="form-input"
            onChange={handleFormChange}
            value={roomID}
            type="text"
            name="roomID"
            placeholder="Room ID..."
            ref={roomInputRef}
          />
          <button className="form-btn" type="submit" onClick={joinRoom}>
            Join Room
          </button>
          <p>
            <a className="contacts link" onClick={() => setInContacts(true)}>
              Manage Contacts
            </a>
          </p>
          <div className="link-container">
            <a className="link" onClick={handleLogout}>
              Logout
            </a>
            <a className="link" onClick={handleDeleteAccount}>
              Delete Account
            </a>
          </div>
        </form>
      </div>
      {/* <Contacts username={username} roomID={roomID} setRoomID={setRoomID} /> */}
    </>
  );
}
