import mongoose, { mongo } from "mongoose";

import FriendModel, { Friend } from "../models/Friend.model";
import UserModel from "../models/User.model";
import { client } from "../config/redis";

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
  const friendExist = await FriendModel.findOne({ $or: [{ userId, friendId }, { userId: friendId, friendId: userId }] });
  if (friendExist) {
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

export async function blockFriend(
  id: string,
  userId: string,
): Promise<Friend> {
  if (!id || !userId) {
    throw new Error("Some arguments are missing");
  }
  if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(userId)) {
    throw new Error("some id invalid");
  }
  const friend = await FriendModel.findById(id);
  if (!friend) {
    throw new Error("Friend does not exist");
  }
  const fromUserId = new mongoose.Types.ObjectId(userId);
  if (fromUserId.equals(friend.friendId)) {
    if (friend.status === "blocked_to") {
      friend.status = "blocked_both";
    } else {
      friend.status = "blocked_from";
    }
  } else if (fromUserId.equals(friend.userId)) {
    if (friend.status === "blocked_from") {
      friend.status = "blocked_both";
    } else {
      friend.status = "blocked_to";
    }
  }
  await friend.save();
  return friend;
}

export async function unBlockFriend(
  id: string,
  userId: string,
): Promise<Friend> {
  if (!id || !userId) {
    throw new Error("Some arguments are missing");
  }
  if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(userId)) {
    throw new Error("some id invalid");
  }
  const friend = await FriendModel.findOne({ $or: [{ friendId: id, userId }, { friendId: userId, userId: id }] });
  if (!friend) {
    throw new Error("Friend does not exist");
  }
  const validUserId = new mongoose.Types.ObjectId(userId);
  if (validUserId.equals(friend.userId)) {
    if (friend.status === 'blocked_to') {
      friend.status = "accepted"
    }
  } else if (validUserId.equals(friend.friendId)) {
    if (friend.status === 'blocked_from') {
      friend.status = "accepted"
    }
  }
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
  const friendship = await FriendModel.findOne({
    $or: [
      { userId: id, friendId },
      { userId: friendId, friendId: id },
    ],
  });
  if (!friendship) {
    throw new Error("Friend does not exist");
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
    status: { $nin: ['pending', 'declined'] },
    $or: [{ userId: id }, { friendId: id }],
  }).populate(["userId", "friendId"]);
  for (const friend of friends) {
    const friendStatus = await client.scard(`user_sockets:${friend.friendId._id}`);
    const userStatus = await client.scard(`user_sockets:${friend.userId._id}`);
    friend.friendId.isOnline = friendStatus > 0;
    friend.userId.isOnline = userStatus > 0;
  }
  return friends;
}

export async function getUserFriendRequests(id: string): Promise<Friend[]> {
  if (!id || !mongoose.isValidObjectId(id)) {
    throw new Error("Invalid user id");
  }
  const friendRequests = await FriendModel.find({
    status: "pending",
    friendId: id
  }).populate(["userId", "friendId"]);
  return friendRequests;
}
