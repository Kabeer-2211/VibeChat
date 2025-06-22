import mongoose, { Schema, Document } from "mongoose";

export interface Chat extends Document {
  message: string;
  receiverId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  isSeen: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

const messageSchema: Schema<Chat> = new Schema({
  message: {
    type: String,
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
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

const MessageModel = mongoose.model<Chat>("Message", messageSchema);

export default MessageModel;
