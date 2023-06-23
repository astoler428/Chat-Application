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
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../model/Users");
function createNewUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, username, password } = req.body;
        if (!name || !username || !password)
            return res.status(400).json({ message: "Missing required field" });
        const existingUser = yield User.findOne({ username: username }).exec();
        if (existingUser)
            return res
                .status(409)
                .json({ message: "User already exists with this username" });
        const hashedPassword = yield bcrypt.hash(password, saltRounds);
        User.create({ name, username, password: hashedPassword });
        return res.status(200).json({ message: "User created" });
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({ message: "Missing required field" });
        const existingUser = yield User.findOne({ username: username }).exec();
        if (!existingUser)
            return res
                .status(404)
                .json({ message: "User with that username does not exist" });
        const match = yield bcrypt.compare(password, existingUser.password);
        if (match)
            return res.status(200).json({ message: "User logged in" });
        else
            return res.status(400).json({ message: "Incorrect password" });
    });
}
module.exports = { createNewUser, login };
