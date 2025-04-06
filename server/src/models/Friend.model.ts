import mongoose, { Schema, Document } from "mongoose";

export interface Friend extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  friendId: mongoose.Schema.Types.ObjectId;
  status: string;
  createdAt: Date;
}

const friendSchema: Schema<Friend> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  status: {
    type: String,
    enum: [
      "pending",
      "accepted",
      "declined",
      "blocked_to",
      "blocked_from",
      "blocked_both",
    ],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const FriendModel = mongoose.model<Friend>("Friend", friendSchema);

export default FriendModel;
