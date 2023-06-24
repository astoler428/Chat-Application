"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
const { deleteContact } = require("./contactController");
const User = require("../model/Users");
const bcrypt = require("bcrypt");
const saltRounds = 10;
//creates a new user
function createNewUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, username, password } = req.body;
        if (!name || !username || !password)
            return res.status(400).json({ message: "Missing required field" });
        //see if the username already exists
        const existingUser = yield User.findOne({ username: username }).exec();
        if (existingUser)
            return res
                .status(409)
                .json({ message: "User already exists with this username" });
        //encrypt the password
        const hashedPassword = yield bcrypt.hash(password, saltRounds);
        User.create({ name, username, password: hashedPassword });
        //emit socket message to frontend to udpate list of users
        server_1.io.emit("user-added", username);
        return res.status(200).json({ message: "User created" });
    });
}
//login authorization
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({ message: "Missing required field" });
        //make sure the user exists
        const existingUser = yield User.findOne({ username: username }).exec();
        if (!existingUser)
            return res
                .status(404)
                .json({ message: "User with that username does not exist" });
        //check password
        const match = yield bcrypt.compare(password, existingUser.password);
        if (match)
            return res.status(200).json({ message: "User logged in" });
        else
            return res.status(400).json({ message: "Incorrect password" });
    });
}
//returns all the usernames
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const allUsers = yield User.find({});
        res.json(allUsers);
    });
}
//deletes a user, all their contacts and they are removed from everyone's contacts
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username } = req.body;
        if (!username)
            return res.status(400).json({ message: "Missing required field" });
        const done = yield User.deleteOne({ username });
        deleteContact(username);
        //emit socket message to frontend to udpate list of users and contacts
        server_1.io.emit("user-deleted", username);
        return res.status(200).json(done);
    });
}
//update password
function updatePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({ message: "Missing required field" });
        //make sure the username exists
        const existingUser = yield User.findOne({ username }).exec();
        if (!existingUser)
            return res
                .status(204)
                .json({ message: "A user with that username does not exist" });
        //hash new password
        const hashedPassword = yield bcrypt.hash(password, saltRounds);
        existingUser.password = hashedPassword;
        yield existingUser.save();
        res.status(200).json(existingUser);
    });
}
module.exports = {
    createNewUser,
    login,
    getAllUsers,
    deleteUser,
    updatePassword,
};
