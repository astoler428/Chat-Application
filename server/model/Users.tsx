import { Schema, model, connect } from "mongoose";

interface IUser {
  name: string;
  username: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//third parameter is collection name
module.exports = model<IUser>("Users", userSchema);
