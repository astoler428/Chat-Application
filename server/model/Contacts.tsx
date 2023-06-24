import { Schema, model } from "mongoose";

interface IContact {
  user: string;
  contact: string;
}

const contactSchema = new Schema<IContact>({
  user: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
});

module.exports = model<IContact>("Contacts", contactSchema);
