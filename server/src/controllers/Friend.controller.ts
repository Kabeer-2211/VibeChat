import { Request, Response } from "express";
import { validationResult } from "express-validator";

import {
  changeFriendShipStatus,
  removeFriend,
  getUserFriends,
} from "../services/friend.service";

export async function changeFriendStatus(
  req: Request,
  res: Response
): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg });
    return;
  }
  try {
    const { friendId, status } = req.body;
    const user = req.user;
    const friend = await changeFriendShipStatus(user.id, friendId, status);
    res
      .status(200)
      .json({ success: true, message: "Friend status updated", friend });
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
