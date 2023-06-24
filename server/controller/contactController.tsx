import { Request, Response } from "express";
const Contact = require("../model/Contacts");

//stores the pair of user, contact in database
async function addContact(req: Request, res: Response) {
  const { user, contact } = req.body;
  if (!user || !contact)
    return res.status(400).json({ message: "Missing required field" });
  if (user === contact)
    return res.status(400).json({ message: "Can't add yourself" });

  //see if already a contact
  const existingContact = await Contact.findOne({
    user,
    contact,
  }).exec();
  if (existingContact)
    return res.status(409).json({ message: "User already has this contact" });
  Contact.create({ user, contact });
  return res.status(200).json({ message: "Contact Added" });
}

//get list of contacts for a user
async function getContacts(req: Request, res: Response) {
  const { user } = req.body;

  if (!user) return res.status(400).json({ message: "Missing required field" });
  const contacts = await Contact.find({ user }).exec();
  return res.status(200).json(contacts);
}

//when a user deletes account, this removes all their contacts and anyone who had them as a contact
async function deleteContact(username: string) {
  if (!username) return;
  await Contact.deleteMany({ user: username });
  await Contact.deleteMany({ contact: username });
}

module.exports = { addContact, getContacts, deleteContact };
