"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const { login, createNewUser } = require("./controller/userController");
connectDB();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); //allows put request body to be accessed
app.post("/register", createNewUser);
app.post("/login", login);
const usernameSocketMap = new Map();
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    socket.on("store-name", (username) => {
        console.log("storing name");
    });
    socket.on("join", (roomID, username) => {
        var _a;
        socket.join(roomID);
        usernameSocketMap.set(socket.id, username);
        const roomMembers = [];
        const rooms = io.of("/").adapter.rooms;
        (_a = rooms
            .get(roomID)) === null || _a === void 0 ? void 0 : _a.forEach((socketID) => roomMembers.push(usernameSocketMap.get(socketID)));
        socket.nsp.to(roomID).emit("room-members", roomMembers); //nsp sends to self apparently
    });
    socket.on("leave", (roomID) => socket.leave(roomID));
    socket.on("message", (message, roomID, name) => {
        socket.to(roomID).emit("message", message, name);
    });
    // socket.on("disconnect", () => console.log("disconnected"));
});
mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    server.listen(3000, () => console.log("server listening on port 3000"));
});
