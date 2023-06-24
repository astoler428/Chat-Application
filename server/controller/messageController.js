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
const Message = require("../model/Messages");
//called from the socket.io on event when a new message is sent on frontend
function storeMessage(roomID, sender, message) {
    return __awaiter(this, void 0, void 0, function* () {
        Message.create({ roomID, sender, message });
    });
}
//gets the message history for a particular room
function getMessageHistory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.params.id)
            return res.status(404).json({ message: "No roomID provided" });
        const roomID = req.params.id;
        const messageHistory = yield Message.find({ roomID });
        res.json(messageHistory);
    });
}
module.exports = { storeMessage, getMessageHistory };
