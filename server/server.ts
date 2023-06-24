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

connectDB();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); //allows put request body to be accessed
app.use(express.json());

app.post("/register", createNewUser);
app.post("/login", login);
app.get("/users", getAllUsers);
app.post("/contact/add", addContact);
app.post("/contact/get", getContacts);
app.post("/roomID", getRoomID);
// app.post("/message/store", storeMessage);
app.get("/messages/:id", getMessageHistory);
app.post("/delete", deleteUser);
app.put("/changepassword", updatePassword);

const usernameSocketMap = new Map<string, string>();

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
  },
});

function getUsernamesInRoom(roomID: string): string[] {
  const roomMembers: string[] = [];
  const rooms = io.of("/").adapter.rooms;
  rooms
    .get(roomID)
    ?.forEach((socketID) => roomMembers.push(usernameSocketMap.get(socketID)!));

  return roomMembers;
}

io.on("connection", (socket) => {
  socket.on("store-username", (username) => {
    usernameSocketMap.set(socket.id, username);
  });

  socket.on("join", (roomID) => {
    socket.join(roomID);
    const roomMembers = getUsernamesInRoom(roomID);
    socket.nsp.to(roomID).emit("room-members", roomMembers); //nsp sends to self apparently
  });

  socket.on("leave", (roomID) => {
    socket.leave(roomID);
    const roomMembers = getUsernamesInRoom(roomID);
    socket.nsp.to(roomID).emit("room-members", roomMembers); //nsp sends to self apparently
  });

  socket.on("message", (message, roomID, name) => {
    //instead of separate POST request, do it here since message is sent to backend already
    storeMessage(roomID, name, message);
    socket.to(roomID).emit("message", message, name);
  });

  socket.on("disconnect", () => usernameSocketMap.delete(socket.id));
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  server.listen(3000, () => console.log("server listening on port 3000"));
});
