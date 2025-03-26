import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface User extends Document {
  username: string;
  avatar: string;
  bio?: string;
  email: string;
  password: string;
  verifyCode: number;
  isVerified: boolean;
  verifiedCodeExpiry: Date;
  isOnline: boolean;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
  generateToken(): Promise<string>;
}

interface UserModel extends Model<User> {
  hashPassword(password: string): Promise<string>;
}

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    trim: true,
  },
  avatar: {
    type: String,
  },
  bio: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  verifyCode: {
    type: Number,
    required: true,
    select: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedCodeExpiry: {
    type: Date,
    required: true,
    select: false,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.statics.hashPassword = async function (
  password: string
): Promise<string> {
  return await bcrypt.hash(password, 10);
};
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateToken = async function (): Promise<string> {
  return await jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET as string
  );
};

const UserModel = mongoose.model<User, UserModel>("User", userSchema);

export default UserModel;
