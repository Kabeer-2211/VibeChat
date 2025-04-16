import fs from "fs";
import path from "path";

import mongoose from "mongoose";

import UserModel, { User } from "../models/User.model";
import FriendModel from "../models/Friend.model";

export async function createUser(
  username: string,
  email: string,
  avatar: string,
  password: string,
  bio?: string
): Promise<User> {
  if (!username || !email || !password) {
    throw new Error("all fields are required");
  }
  const hashedPassword = await UserModel.hashPassword(password);
  const verifyCode = Math.floor(100000 + Math.random() * 900000);
  const verifiedCodeExpiry = new Date();
  verifiedCodeExpiry.setHours(verifiedCodeExpiry.getHours() + 1);
  const user = await UserModel.create({
    username,
    email,
    avatar,
    bio,
    password: hashedPassword,
    verifyCode,
    verifiedCodeExpiry,
  });
  return user;
}

export async function verifyUser(
  id: string,
  verifyCode: Number
): Promise<User> {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error("Invalid user id");
  }
  const user = await UserModel.findById(id).select([
    "+verifyCode",
    "+verifiedCodeExpiry",
  ]);
  if (!user) {
    throw new Error("user does not exist");
  }
  if (user.isVerified) {
    throw new Error("user already verified");
  }
  if (verifyCode != user.verifyCode) {
    throw new Error("Invalid verification code");
  }
  const expiryDate = user.verifiedCodeExpiry;
  const currentDate = new Date();
  if (expiryDate < currentDate) {
    throw new Error("verification code expired");
  }
  user.isVerified = true;
  await user.save();
  return user;
}

export async function changeUserPassword(
  id: string,
  password: string,
  new_password: string
): Promise<User> {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error("Invalid user id");
  }
  const user = await UserModel.findById(id).select("+password");
  if (!user) {
    throw new Error("User does not exist");
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new Error("Incorrect password");
  }
  const hashedPassword = await UserModel.hashPassword(new_password);
  user.password = hashedPassword;
  await user.save();
  return user;
}

export async function updateUserProfile(
  id: string,
  username?: string,
  bio?: string,
  avatar?: string
): Promise<User> {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new Error("User does not exist");
  }
  if (!user.isVerified) {
    throw new Error("User not verified");
  }
  if (username || bio || avatar) {
    if (avatar && user.avatar !== "user.png") {
      fs.unlink(
        path.join(__dirname, `/../../../src/public/avatars/${user.avatar}`),
        () => { }
      );
    }
    user.username = username || user.username;
    user.bio = bio || "";
    user.avatar = avatar || user.avatar;
    await user.save();
  }
  return user;
}

export async function deleteUserProfilePicture(user: User): Promise<User> {
  if (user.avatar !== "user.png") {
    fs.unlink(
      path.join(__dirname, `/../../../src/public/avatars/${user.avatar}`),
      () => { }
    );
  }
  const newUser = await UserModel.findById(user._id);
  if (!newUser) {
    throw new Error("User does not exist");
  }
  newUser.avatar = "user.png";
  await newUser.save();
  return newUser;
}

export async function searchUser(query: string, id: string): Promise<User[]> {
  if (!query) {
    throw new Error("query is required");
  }
  const friends = await FriendModel.find({ $or: [{ userId: id }, { friendId: id }] });
  const excludeIds = new Set();
  friends.map(item => {
    if (item.friendId) excludeIds.add(item.friendId.toString());
    if (item.userId) excludeIds.add(item.userId.toString());
  });
  const users = await UserModel.find({
    _id: { $nin: Array.from(excludeIds) },
    isVerified: true,
    $or: [{ email: query }, { $text: { $search: query } }],
  }).limit(30);
  return users;
}
