import { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { AccountInfo, SocketContext } from "./App";
import {
  fetchCreateNewContact,
  fetchAllUsers,
  fetchContacts,
  fetchRoomID,
} from "./apiCalls";
import { useNavigate, NavLink, useOutletContext } from "react-router-dom";
import { OutletContext } from "./LoginRequired";

interface SelectOption {
  value: string;
  label: string;
}

interface ContactsProps {
  username: string;
  roomID: string;
  setRoomID: React.Dispatch<React.SetStateAction<string>>;
}

interface ContactObj {
  user: string;
  contact: string;
}

export default function Contacts({ username, setRoomID }: ContactsProps) {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [myContacts, setMyContacts] = useState<string[]>([]);
  const [newContact, setNewContact] = useState<SelectOption | null>(null); //contact chosen to add in select field
  const [existingContact, setExistingContact] = useState<SelectOption | null>(
    null
  ); //contact chosen to private message in select field
  const { socket } = useContext(SocketContext)!;
  const { setPrivateRoom }: OutletContext = useOutletContext();

  //sets contacts upon rendering page
  useEffect(() => {
    getMyContacts();

    async function getMyContacts() {
      let response = await fetchContacts(username); //fetch my contacts
      let contacts: ContactObj[] = await response.json();
      let contactNames: string[] = contacts.map(
        (contactObj: ContactObj) => contactObj.contact
      ); //convert to just the username
      setMyContacts(contactNames);
    }
  }, []);

  //sets all users upon rendering page. Users gets filtered later by excluding the contacts
  useEffect(() => {
    getAllUsers();

    async function getAllUsers() {
      const response = await fetchAllUsers();
      let users = await response.json();
      users = users.map((userObj: AccountInfo) => userObj.username);
      setAllUsers(users);
    }
  }, []);

  //listeners for users added or deleted - updates the select field of users
  useEffect(() => {
    socket?.on("user-added", (username) => {
      setAllUsers((prevUsers) => [...prevUsers, username]);
    });

    socket?.on("user-deleted", (username) => {
      setAllUsers((prevUsers) => prevUsers.filter((name) => name !== username));
      setMyContacts((prevContacts) =>
        prevContacts.filter((name) => name !== username)
      );
    });
  }, [socket]);

  //event handler for adding a contact
  async function addContact() {
    if (!newContact) return;
    await fetchCreateNewContact(username, newContact.value); //send to server
    setMyContacts((prevContacts) => [...prevContacts, newContact.value]); //adjust contacts
    setNewContact(null); //clear chosen contact from select field
  }

  //event listener for opening a private chat
  async function openPrivateRoom() {
    if (!existingContact) return;

    //get the unique roomID for this pair of users
    const response = await fetchRoomID(username, existingContact.value);
    const theRoomID = await response.json();
    setRoomID(theRoomID);
    socket?.emit("join", theRoomID);
    setPrivateRoom(existingContact.value); //set that it's a private room by passing the contact username
    navigate("/chat");
  }

  //filter users by not being in contacts
  const nonContactUsers = allUsers.filter(
    (user) => user !== username && !myContacts.includes(user)
  );

  //set options for each react-select component
  const newContactSelectOptions = nonContactUsers.map((user) => {
    return { value: user, label: user };
  });

  const existingContactSelectOptions = myContacts.map((contact) => {
    return { value: contact, label: contact };
  });

  return (
    <div className="contacts-border">
      <div className="form">
        <h1 className="title black">Add New Contact</h1>
        <Select
          className="contact-select"
          placeholder="Search users..."
          value={newContact}
          options={newContactSelectOptions}
          onChange={(selectedOption) => setNewContact(selectedOption!)}
        />
        <button className="form-btn black-background" onClick={addContact}>
          Add Contact
        </button>
        <h1 className="title black margin-top">Existing Contacts</h1>
        <Select
          className="contact-select"
          placeholder="Search contacts..."
          value={existingContact}
          options={existingContactSelectOptions}
          onChange={(selectedOption) => setExistingContact(selectedOption!)}
        />
        <button className="form-btn black-background" onClick={openPrivateRoom}>
          Private Message
        </button>
        <NavLink to="/home" className="link">
          Back to Home
        </NavLink>
      </div>
    </div>
  );
}
