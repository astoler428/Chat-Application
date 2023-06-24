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
const Room = require("../model/Rooms");
const { v4: uuidv4 } = require("uuid");
function getRoomID(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user1, user2 } = req.body;
        if (!user1 || !user2)
            return res.status(400).json({ message: "Missing required field" });
        let roomDocument;
        let roomID;
        //check both directions
        roomDocument = yield Room.findOne({ user1, user2 }).exec();
        if (!roomDocument)
            roomDocument = yield Room.findOne({ user1: user2, user2: user1 }).exec();
        if (!roomDocument) {
            roomID = uuidv4();
            Room.create({ user1, user2, roomID });
        }
        else
            roomID = roomDocument.roomID;
        res.json(roomID);
    });
}
module.exports = { getRoomID };
