import mongoose from "mongoose";

import FriendModel, { Friend } from "../models/Friend.model";
import UserModel from "../models/User.model";

export async function createFriend(
  userId: string,
  friendId: string,
  status: string = "pending"
): Promise<Friend> {
  if (!userId || !friendId) {
    throw new Error("user id and friend id is required");
  }
  if (userId === friendId) {
    throw new Error("You can't send friend request to yourself");
  }

  const friend = await FriendModel.create({ userId, friendId, status });
  if (!friend) {
    throw new Error("could not create friend");
  }
  return friend;
}

export async function changeFriendShipStatus(
  id: string,
  friendId: string,
  status: string
): Promise<Friend> {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error("Invalid user id");
  }
  if (!mongoose.isValidObjectId(friendId)) {
    throw new Error("Invalid friend id");
  }
  const friendship = await FriendModel.findOne({
    $or: [
      { userId: id, friendId },
      { userId: friendId, friendId: id },
    ],
  });
  const friendExist = await UserModel.findById(friendId);
  if (!friendExist) {
    throw new Error("Requested user does not exist");
  }
  if (friendship) {
    if (!status || status === "pending") {
      throw new Error("Friend request already exists");
    } else {
      friendship.status = status;
      await friendship.save();
      return friendship;
    }
  }
  if (status && status !== "pending") {
    throw new Error(`can not create friend with status ${status}`);
  }
  const friend = await createFriend(id, friendId, status);
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
