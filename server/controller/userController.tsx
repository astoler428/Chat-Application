import { Request, Response } from "express";
import { io } from "../server";
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../model/Users");

async function createNewUser(req: Request, res: Response) {
  const { name, username, password } = req.body;
  if (!name || !username || !password)
    return res.status(400).json({ message: "Missing required field" });

  const existingUser = await User.findOne({ username: username }).exec();

  if (existingUser)
    return res
      .status(409)
      .json({ message: "User already exists with this username" });

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  User.create({ name, username, password: hashedPassword });

  //emit socket message
  io.emit("new-user", username);
  console.log("new user emitted");

  return res.status(200).json({ message: "User created" });
}

async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Missing required field" });

  const existingUser = await User.findOne({ username: username }).exec();

  if (!existingUser)
    return res
      .status(404)
      .json({ message: "User with that username does not exist" });

  const match = await bcrypt.compare(password, existingUser.password);

  if (match) return res.status(200).json({ message: "User logged in" });
  else return res.status(400).json({ message: "Incorrect password" });
}

async function getAllUsers(req: Request, res: Response) {
  const allUsers = await User.find({});
  res.json(allUsers);
}

async function deleteUser(req: Request, res: Response) {
  const { username } = req.body;
  if (!username)
    return res.status(400).json({ message: "Missing required field" });

  const done = await User.deleteOne({ username });
  return res.status(200).json(done);
}

async function updatePassword(req: Request, res: Response) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Missing required field" });

  const existingUser = await User.findOne({ username }).exec();

  if (!existingUser)
    return res
      .status(204)
      .json({ message: "A user with that username does not exist" });

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  existingUser.password = hashedPassword;
  console.log(existingUser.password);
  await existingUser.save();
  res.status(200).json(existingUser);
}

module.exports = {
  createNewUser,
  login,
  getAllUsers,
  deleteUser,
  updatePassword,
};
