import { Request, Response } from "express";
const Contact = require("../model/Contacts");

async function addContact(req: Request, res: Response) {
  const { user, contact } = req.body;
  if (!user || !contact)
    return res.status(400).json({ message: "Missing required field" });
  if (user === contact)
    return res.status(400).json({ message: "Can't add yourself" });
  const existingContact = await Contact.findOne({
    user,
    contact,
  }).exec();
  if (existingContact)
    return res.status(409).json({ message: "User already has this contact" });
  Contact.create({ user, contact });
  return res.status(200).json({ message: "Contact Added" });
}

async function getContacts(req: Request, res: Response) {
  const { user } = req.body;

  if (!user) return res.status(400).json({ message: "Missing required field" });
  const contacts = await Contact.find({ user }).exec();
  return res.status(200).json(contacts);
}

module.exports = { addContact, getContacts };
