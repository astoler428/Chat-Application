import { model, Schema } from "mongoose";

export interface IMessage {
  roomID: string;
  sender: string;
  message: string;
  date: number;
}

const messageSchema = new Schema<IMessage>({
  roomID: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    required: true,
    default: Date.now(),
  },
});

module.exports = model<IMessage>("Messages", messageSchema);
