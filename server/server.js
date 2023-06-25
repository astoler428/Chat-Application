"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
require("dotenv").config();
const mongoose = require("mongoose");
const socket_io_1 = require("socket.io");
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const server = http.createServer(app);
const connectDB = require("./config/dbConn");
const bodyParser = require("body-parser");
const { login, createNewUser, getAllUsers, deleteUser, updatePassword, } = require("./controller/userController");
const { addContact, getContacts } = require("./controller/contactController");
const { getRoomID } = require("./controller/roomController");
const { storeMessage, getMessageHistory, } = require("./controller/messageController");
//variables to track the socket information
const usernameSocketMap = new Map(); //map socket.id to username
let currentRoomID = "";
//connects to Database
connectDB();
exports.io = new socket_io_1.Server(server, {
    cors: {
        // origin: "http://localhost:5173",
        origin: "http://ari-chatapp.netlify.app",
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
exports.io.on("connection", (socket) => {
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
        if (currentRoomID !== "")
            notifyRoomMembers(currentRoomID);
        usernameSocketMap.delete(socket.id);
    });
    function notifyRoomMembers(roomID) {
        const roomMembers = getUsernamesInRoom(roomID);
        socket.nsp.to(roomID).emit("room-members", roomMembers); //nsp sends to self apparently
    }
});
//helper function that returns all usernames in a particular room
function getUsernamesInRoom(roomID) {
    var _a;
    const roomMembers = [];
    const rooms = exports.io.of("/").adapter.rooms;
    (_a = rooms
        .get(roomID)) === null || _a === void 0 ? void 0 : _a.forEach((socketID) => roomMembers.push(usernameSocketMap.get(socketID)));
    return roomMembers;
}
mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    server.listen(3000, () => console.log("server listening on port 3000"));
});
