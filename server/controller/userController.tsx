import { Request, Response } from "express";
import { io } from "../server";
const { deleteContact } = require("./contactController");
const User = require("../model/Users");
const bcrypt = require("bcrypt");
const saltRounds = 10;

//creates a new user
async function createNewUser(req: Request, res: Response) {
  const { name, username, password } = req.body;
  if (!name || !username || !password)
    return res.status(400).json({ message: "Missing required field" });

  //see if the username already exists
  const existingUser = await User.findOne({ username: username }).exec();

  if (existingUser)
    return res
      .status(409)
      .json({ message: "User already exists with this username" });

  //encrypt the password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  User.create({ name, username, password: hashedPassword });

  //emit socket message to frontend to udpate list of users
  io.emit("user-added", username);

  return res.status(200).json({ message: "User created" });
}

//login authorization
async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Missing required field" });

  //make sure the user exists
  const existingUser = await User.findOne({ username: username }).exec();

  if (!existingUser)
    return res
      .status(404)
      .json({ message: "User with that username does not exist" });

  //check password
  const match = await bcrypt.compare(password, existingUser.password);

  if (match) return res.status(200).json({ message: "User logged in" });
  else return res.status(400).json({ message: "Incorrect password" });
}

//returns all the usernames
async function getAllUsers(req: Request, res: Response) {
  const allUsers = await User.find({});
  res.json(allUsers);
}

//deletes a user, all their contacts and they are removed from everyone's contacts
async function deleteUser(req: Request, res: Response) {
  const { username } = req.body;
  if (!username)
    return res.status(400).json({ message: "Missing required field" });

  const done = await User.deleteOne({ username });
  deleteContact(username);

  //emit socket message to frontend to udpate list of users and contacts
  io.emit("user-deleted", username);

  return res.status(200).json(done);
}

//update password
async function updatePassword(req: Request, res: Response) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Missing required field" });

  //make sure the username exists
  const existingUser = await User.findOne({ username }).exec();

  if (!existingUser)
    return res
      .status(204)
      .json({ message: "A user with that username does not exist" });

  //hash new password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  existingUser.password = hashedPassword;
  await existingUser.save();
  res.status(200).json(existingUser);
}

//controller for when frontend makes a request to backend on timer to keep awake
async function wakeup(req: Request, res: Response) {
  //make a random call to database to keep awake
  await User.findOne({ username: "Wake Up" });
  res.status(200).json({ msg: "We are awake" });
}

module.exports = {
  createNewUser,
  login,
  getAllUsers,
  deleteUser,
  updatePassword,
  wakeup,
};
