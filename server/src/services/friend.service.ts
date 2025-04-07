import mongoose from "mongoose";

import FriendModel, { Friend } from "../models/Friend.model";
import UserModel from "../models/User.model";

export async function createFriendRequest(
  userId: string,
  friendId: string,
): Promise<Friend> {
  if (!userId || !friendId) {
    throw new Error("user id and friend id are required");
  }
  if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(friendId)) {
    throw new Error("invalid friend or user id");
  }
  if (userId == friendId) {
    throw new Error("You can't send friend request to yourself");
  }
  const userExist = await UserModel.findById(friendId);
  if (!userExist) {
    throw new Error("Requested user does not exist");
  }
  const friendExist = await FriendModel.find({ $or: [{ userId, friendId }, { userId: friendId, friendId: userId }] });
  if (friendExist[0]) {
    throw new Error("Friend already exist")
  }
  const friend = await FriendModel.create({ userId, friendId, status: "pending" });
  if (!friend) {
    throw new Error("could not create friend");
  }
  return friend;
}

export async function acceptFriendRequest(
  id: string,
): Promise<Friend> {
  if (!id) {
    throw new Error("id is required");
  }
  if (!mongoose.isValidObjectId(id)) {
    throw new Error("invalid id");
  }
  const friend = await FriendModel.findById(id);
  if (!friend) {
    throw new Error("Friend request does not exist")
  }
  friend.status = "accepted";
  await friend.save();
  return friend;
}


export async function removeFriend(
  id: string,
  friendId: string
): Promise<void> {
  if (!mongoose.isValidObjectId(friendId)) {
    throw new Error("Invalid friend id");
  }
  const friendship = await FriendModel.find({
    $or: [
      { userId: id, friendId },
      { userId: friendId, friendId: id },
    ],
  });
  if (!friendship[0]) {
    throw new Error("Friend does not exist");
  }
  if (friendship[0].status !== "accepted") {
    throw new Error("Invalid Request");
  }
  await FriendModel.deleteOne({
    $or: [
      { userId: id, friendId },
      { userId: friendId, friendId: id },
    ],
  });
}

export async function getUserFriends(id: string): Promise<Friend[]> {
  if (!id || !mongoose.isValidObjectId(id)) {
    throw new Error("Invalid user id");
  }
  const friends = await FriendModel.find({
    $or: [{ userId: id }, { friendId: id }],
  }).populate(["userId", "friendId"]);
  return friends;
}
