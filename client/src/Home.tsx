import React, { useEffect, useRef, useContext } from "react";
import { SocketContext } from "./App";
import { fetchDeleteUser } from "./apiCalls";
import { useNavigate, NavLink, useOutletContext } from "react-router-dom";
import { OutletContext } from "./LoginRequired";

interface Home {
  roomID: string;
  setRoomID: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Home({
  roomID,
  setRoomID,
  username,
  setLoggedIn,
}: Home) {
  const navigate = useNavigate();
  const roomInputRef = useRef<HTMLInputElement>(null);
  let { socket } = useContext(SocketContext)!;
  const { setPrivateRoom }: OutletContext = useOutletContext();

  //used to set focus upon rendering
  useEffect(() => {
    roomInputRef.current!.focus();
  }, []);

  //when user connects to socket, send username to store
  socket?.on("connect", () => {
    socket?.emit("store-username", username);
  });

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setRoomID(e.target.value);
  }

  //event handler for joining room
  async function joinRoom(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (roomID) {
      socket?.emit("join", roomID); //tell server what roomID is
      setPrivateRoom(""); //not a private room
      navigate("/chat");
    }
  }

  function handleLogout() {
    // Don't need to navigate as LoginRequired component redirects when loggedIn false
    setLoggedIn(false);
    socket?.disconnect();
  }

  async function handleDeleteAccount() {
    await fetchDeleteUser(username);
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
            <NavLink to="/contacts" className="contacts link">
              Manage Contacts
            </NavLink>
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
    </>
  );
}
