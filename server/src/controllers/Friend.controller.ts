import { Request, Response } from "express";
import { validationResult } from "express-validator";

import {
  createFriendRequest,
  acceptFriendRequest,
  removeFriend,
  getUserFriends,
  getUserFriendRequests,
  blockFriend as block,
  unBlockFriend as unBlock,
  getMessages,
  updateMessageStatus,
} from "../services/friend.service";

export async function createFriend(
  req: Request,
  res: Response
): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg });
    return;
  }
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      res.status(400).json({ success: false, message: "User not found" });
      return;
    }
    const friend = await createFriendRequest(user._id, id);
    res
      .status(200)
      .json({ success: true, message: "Friend request added", friend });
    return;
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ success: false, message: error.message });
    return;
  }
}

export async function acceptFriend(
  req: Request<{ id: string }>,
  res: Response
): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg });
    return;
  }
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      res.status(400).json({ success: false, message: "User not found" });
      return;
    }
    const friend = await acceptFriendRequest(id);
    res
      .status(200)
      .json({ success: true, message: "Friend request accepted", friend });
    return;
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ success: false, message: error.message });
    return;
  }
}

export async function blockFriend(
  req: Request<{ id: string }>,
  res: Response
): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg });
    return;
  }
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      res.status(400).json({ success: false, message: "User not found" });
      return;
    }
    const friend = await block(id, user._id);
    res
      .status(200)
      .json({ success: true, message: "Friend blocked successfully", friend });
    return;
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ success: false, message: error.message });
    return;
  }
}

export async function unBlockFriend(
  req: Request<{ id: string }>,
  res: Response
): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg });
    return;
  }
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      res.status(400).json({ success: false, message: "User not found" });
      return;
    }
    const friend = await unBlock(id, user._id);
    res
      .status(200)
      .json({ success: true, message: "Friend unblocked successfully", friend });
    return;
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ success: false, message: error.message });
    return;
  }
}

export async function deleteFriend(
  req: Request<{ id: string }>,
  res: Response
): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg });
    return;
  }
  try {
    const { id } = req.user;
    const friendId = req.params.id;
    await removeFriend(id, friendId);
    res.status(200).json({ success: true, message: "Friend removed" });
    return;
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ success: false, message: error.message });
    return;
  }
}

export async function getFriends(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      res.status(400).json({ success: false, message: "User not found" });
      return;
    }
    const friends = await getUserFriends(user.id);
    res.status(200).json({
      success: true,
      message: "Friends retrieved successfully",
      friends,
    });
    return;
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ success: false, message: error.message });
    return;
  }
}

export async function getFriendRequests(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      res.status(400).json({ success: false, message: "User not found" });
      return;
    }
    const friendRequests = await getUserFriendRequests(user.id);
    res.status(200).json({
      success: true,
      message: "Friends retrieved successfully",
      friendRequests,
    });
    return;
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ success: false, message: error.message });
    return;
  }
}

export async function getChatMessages(req: Request<{ id: string }>, res: Response): Promise<void> {
  try {
    const user = req.user;
    const friendId = req.params.id;
    if (!user) {
      res.status(400).json({ success: false, message: "User not found" });
      return;
    }
    const messages = await getMessages(user.id, friendId);
    res.status(200).json({
      success: true,
      message: "Messages retrieved successfully",
      messages,
    });
    return;
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ success: false, message: error.message });
    return;
  }
}

export async function markMessageAsRead(req: Request<{ id: string }>, res: Response): Promise<void> {
  try {
    const user = req.user;
    const receiverId = req.params.id;
    if (!user) {
      res.status(400).json({ success: false, message: "User not found" });
      return;
    }
    await updateMessageStatus(user.id, receiverId);
    res.status(200).json({
      success: true,
      message: "Messages marked as read successfully",
    });
    return;
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ success: false, message: error.message });
    return;
  }
}