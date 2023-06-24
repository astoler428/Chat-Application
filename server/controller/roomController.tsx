import { Request, Response } from "express";
const Room = require("../model/Rooms");
const { v4: uuidv4 } = require("uuid");

export interface IRoom {
  user1: string;
  user2: string;
  roomID: string;
}

async function getRoomID(req: Request, res: Response) {
  const { user1, user2 } = req.body;
  if (!user1 || !user2)
    return res.status(400).json({ message: "Missing required field" });

  let roomDocument: IRoom;
  let roomID: string;

  //check both directions
  roomDocument = await Room.findOne({ user1, user2 }).exec();
  if (!roomDocument)
    roomDocument = await Room.findOne({ user1: user2, user2: user1 }).exec();
  if (!roomDocument) {
    roomID = uuidv4();
    Room.create({ user1, user2, roomID });
  } else roomID = roomDocument.roomID;

  res.json(roomID);
}

module.exports = { getRoomID };
