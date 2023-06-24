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
const Contact = require("../model/Contacts");
//stores the pair of user, contact in database
function addContact(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user, contact } = req.body;
        if (!user || !contact)
            return res.status(400).json({ message: "Missing required field" });
        if (user === contact)
            return res.status(400).json({ message: "Can't add yourself" });
        //see if already a contact
        const existingContact = yield Contact.findOne({
            user,
            contact,
        }).exec();
        if (existingContact)
            return res.status(409).json({ message: "User already has this contact" });
        Contact.create({ user, contact });
        return res.status(200).json({ message: "Contact Added" });
    });
}
//get list of contacts for a user
function getContacts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user } = req.body;
        if (!user)
            return res.status(400).json({ message: "Missing required field" });
        const contacts = yield Contact.find({ user }).exec();
        return res.status(200).json(contacts);
    });
}
//when a user deletes account, this removes all their contacts and anyone who had them as a contact
function deleteContact(username) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!username)
            return;
        yield Contact.deleteMany({ user: username });
        yield Contact.deleteMany({ contact: username });
    });
}
module.exports = { addContact, getContacts, deleteContact };
