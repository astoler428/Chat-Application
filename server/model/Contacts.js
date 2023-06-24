"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const contactSchema = new mongoose_1.Schema({
    user: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
});
module.exports = (0, mongoose_1.model)("Contacts", contactSchema);
