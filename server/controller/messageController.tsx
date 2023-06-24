import { Request, Response } from "express";
const Message = require("../model/Messages");

//called from the socket.io on event when a new message is sent on frontend
async function storeMessage(roomID: string, sender: string, message: string) {
  Message.create({ roomID, sender, message });
}

//gets the message history for a particular room
async function getMessageHistory(req: Request, res: Response) {
  if (!req.params.id)
    return res.status(404).json({ message: "No roomID provided" });

  const roomID = req.params.id;
  const messageHistory = await Message.find({ roomID });
  res.json(messageHistory);
}

module.exports = { storeMessage, getMessageHistory };
