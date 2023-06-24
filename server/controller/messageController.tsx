import { Request, Response } from "express";
const Message = require("../model/Messages");

async function storeMessage(roomID: string, sender: string, message: string) {
  // const { roomID, sender, message } = req.body;
  // if (!roomID || !sender || !message)
  //   return res.status(400).json({ message: "Missing required field" });

  Message.create({ roomID, sender, message });
  // return res.status(200).json({ message: "Message Stored" });
}

async function getMessageHistory(req: Request, res: Response) {
  if (!req.params.id)
    return res.status(404).json({ message: "No roomID provided" });

  const roomID = req.params.id;
  const messageHistory = await Message.find({ roomID });
  res.json(messageHistory);
}

module.exports = { storeMessage, getMessageHistory };
