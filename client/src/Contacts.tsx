import { useState, useEffect, useContext } from "react";
import Select from "react-select";
import {
  AccountInfo,
  SocketContext,
  InRoomContext,
  MessageHistoryContext,
} from "./App";
import {
  fetchCreateNewContact,
  fetchAllUsers,
  fetchContacts,
  fetchRoomID,
  fetchMessageHistory,
} from "./apiCalls";

interface SelectOption {
  value: string;
  label: string;
}

interface ContactsProps {
  username: string;
  roomID: string;
  setRoomID: React.Dispatch<React.SetStateAction<string>>;
  setInContacts: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ContactObj {
  user: string;
  contact: string;
}

export default function Contacts({
  username,
  roomID,
  setRoomID,
  setInContacts,
}: ContactsProps) {
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [myContacts, setMyContacts] = useState<string[]>([]);
  const [newContact, setNewContact] = useState<SelectOption | null>(null);
  const [existingContact, setExistingContact] = useState<SelectOption | null>(
    null
  );
  const { socket } = useContext(SocketContext)!;
  const setInRoom = useContext(InRoomContext);
  const [messageHistory, setMessageHistory] = useContext(
    MessageHistoryContext
  )!;

  useEffect(() => {
    socket?.on("new-user", (username) => {
      setAllUsers((prevUsers) => [...prevUsers, username]);
    });
  }, [socket]);

  useEffect(() => {
    getMyContacts();

    async function getMyContacts() {
      let response = await fetchContacts(username);
      let contacts = await response.json();
      contacts = contacts.map((contactObj: ContactObj) => contactObj.contact);
      setMyContacts(contacts);
    }
  }, []);

  useEffect(() => {
    getAllUsers();

    async function getAllUsers() {
      const response = await fetchAllUsers();
      let users = await response.json();
      users = users.map((userObj: AccountInfo) => userObj.username);
      setAllUsers(users);
    }
  }, []);

  async function addContact() {
    if (!newContact) return;
    await fetchCreateNewContact(username, newContact.value);
    setMyContacts((prevContacts) => [...prevContacts, newContact.value]);
    setNewContact(null);
  }

  async function openPrivateRoom() {
    if (!existingContact) return;

    const response = await fetchRoomID(username, existingContact.value);
    const theRoomID = await response.json();
    setInRoom(true);
    setRoomID(theRoomID);
    socket?.emit("join", theRoomID);

    //fetch and set history
    const res = await fetchMessageHistory(theRoomID);
    const oldMessages = await res.json();
    setMessageHistory(oldMessages);
  }

  const nonContactUsers = allUsers.filter(
    (user) => user !== username && !myContacts.includes(user)
  );
  const newContactSelectOptions = nonContactUsers.map((user) => {
    return { value: user, label: user };
  });

  const existingContactSelectOptions = myContacts.map((contact) => {
    return { value: contact, label: contact };
  });

  return (
    <div className="border contacts-border">
      <div className="login-container">
        <h1>Add New Contact</h1>
        <Select
          className="contact-select"
          placeholder="Search users..."
          value={newContact}
          options={newContactSelectOptions}
          onChange={(selectedOption) => setNewContact(selectedOption!)}
        />
        <button className="add-contact-btn" onClick={addContact}>
          Add Contact
        </button>
        <h1 className="contacts-title">Existing Contacts</h1>
        <Select
          className="contact-select"
          placeholder="Search contacts..."
          value={existingContact}
          options={existingContactSelectOptions}
          onChange={(selectedOption) => setExistingContact(selectedOption!)}
        />
        <button className="private-message-btn" onClick={openPrivateRoom}>
          Private Message
        </button>
        <a className="logout-link" onClick={() => setInContacts(false)}>
          Back to Chats
        </a>
      </div>
    </div>
  );
}

//move private message up to home - rename home? or reorganize home
