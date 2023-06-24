"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const roomSchema = new mongoose_1.Schema({
    user1: {
        type: String,
        required: true,
    },
    user2: {
        type: String,
        required: true,
    },
    roomID: {
        type: String,
        required: true,
    },
});
//third parameter is collection name
module.exports = (0, mongoose_1.model)("Rooms", roomSchema);
