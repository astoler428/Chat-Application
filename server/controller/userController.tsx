import { Request, Response } from "express";
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

module.exports = { createNewUser, login };
