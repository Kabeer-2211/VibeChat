import mongoose, { Schema, Document } from "mongoose";

export interface Chat extends Document {
  message: string;
  receiverId: mongoose.Schema.Types.ObjectId;
  isSeen: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface Friend extends Document {
  userId: mongoose.Types.ObjectId;
  friendId: mongoose.Types.ObjectId;
  status: string;
  chat: [Chat];
  createdAt: Date;
}

const messageSchema: Schema<Chat> = new Schema({
  message: {
    type: String,
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refs: "User",
  },
  isSeen: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
  deletedAt: Date,
});

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
  chat: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const FriendModel = mongoose.model<Friend>("Friend", friendSchema);

export default FriendModel;
