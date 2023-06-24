require("dotenv").config();
const mongoose = require("mongoose");
import { Server } from "socket.io";

const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const server = http.createServer(app);
const connectDB = require("./config/dbConn");
const bodyParser = require("body-parser");

const {
  login,
  createNewUser,
  getAllUsers,
  deleteUser,
  updatePassword,
} = require("./controller/userController");
const { addContact, getContacts } = require("./controller/contactController");
const { getRoomID } = require("./controller/roomController");
const {
  storeMessage,
  getMessageHistory,
} = require("./controller/messageController");

//variables to track the socket information
const usernameSocketMap = new Map<string, string>(); //map socket.id to username
let currentRoomID: string = "";

//connects to Database
connectDB();

export const io = new Server(server, {
  cors: {
    // origin: "http://localhost:5173",
    origin: "ari-chat-app.netlify.app",
    methods: ["GET", "POST", "PUT"],
  },
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); //allows put request body to be accessed
app.use(express.json());

//custom middleware

app.post("/register", createNewUser);
app.post("/login", login);
app.get("/users", getAllUsers);
app.post("/contact/add", addContact);
app.post("/contact/get", getContacts);
app.post("/roomID", getRoomID);
app.get("/messages/:id", getMessageHistory);
app.post("/delete", deleteUser);
app.put("/changepassword", updatePassword);

io.on("connection", (socket) => {
  //called when a new user connects. Put socket.id and username into map
  socket.on("store-username", (username) => {
    usernameSocketMap.set(socket.id, username);
  });

  //called when a user joins a room
  socket.on("join", (roomID) => {
    socket.join(roomID);
    currentRoomID = roomID;
    notifyRoomMembers(roomID);
  });

  //called when a user joins a room
  socket.on("leave", (roomID) => {
    socket.leave(roomID);
    currentRoomID = "";
    notifyRoomMembers(roomID);
  });

  //called when a new message is sent. Gets stored in database and shared
  socket.on("message", (message, roomID, name) => {
    storeMessage(roomID, name, message);
    socket.to(roomID).emit("message", message, name);
  });

  //notify room members that you left and remove id/username from map
  socket.on("disconnect", () => {
    if (currentRoomID !== "") notifyRoomMembers(currentRoomID);
    usernameSocketMap.delete(socket.id);
  });

  function notifyRoomMembers(roomID: string) {
    const roomMembers = getUsernamesInRoom(roomID);
    socket.nsp.to(roomID).emit("room-members", roomMembers); //nsp sends to self apparently
  }
});

//helper function that returns all usernames in a particular room
function getUsernamesInRoom(roomID: string): string[] {
  const roomMembers: string[] = [];
  const rooms = io.of("/").adapter.rooms;
  rooms
    .get(roomID)
    ?.forEach((socketID) => roomMembers.push(usernameSocketMap.get(socketID)!));

  return roomMembers;
}

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  server.listen(3000, () => console.log("server listening on port 3000"));
});
