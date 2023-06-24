import { Request, Response } from "express";
const Room = require("../model/Rooms");
const { v4: uuidv4 } = require("uuid");

//this collection generates and stores roomID's for private chats between pairs of users

export interface IRoom {
  user1: string;
  user2: string;
  roomID: string;
}

//creates if necessary and return the roomID for a pair of users
async function getRoomID(req: Request, res: Response) {
  const { user1, user2 } = req.body;
  if (!user1 || !user2)
    return res.status(400).json({ message: "Missing required field" });

  let roomIDdocument: IRoom;
  let roomID: string;

  //check both orderings for an existing roomID document in the database
  roomIDdocument = await Room.findOne({ user1, user2 }).exec();
  if (!roomIDdocument)
    roomIDdocument = await Room.findOne({ user1: user2, user2: user1 }).exec();
  if (!roomIDdocument) {
    //create random roomID, store it and return it
    roomID = uuidv4();
    Room.create({ user1, user2, roomID });
  } else roomID = roomIDdocument.roomID;

  res.json(roomID);
}

module.exports = { getRoomID };
