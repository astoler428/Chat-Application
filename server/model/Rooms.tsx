import { Schema, model } from "mongoose";

export interface IRoom {
  user1: string;
  user2: string;
  roomID: string;
}

const roomSchema = new Schema<IRoom>({
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

module.exports = model<IRoom>("Rooms", roomSchema);
