import { Router } from "express";
import { body, param } from "express-validator";

import { auth } from "../middleware/Auth.middleware";
import * as friendController from "../controllers/Friend.controller";

const router = Router();

router.post(
  "/add-friend-request",
  [
    body("friendId").isString().withMessage("Friend id is required"),
  ],
  auth,
  friendController.createFriend
);

router.put(
  "/accept-friend-request/:id",
  [
    param("id").isString().withMessage("id is required"),
  ],
  auth,
  friendController.acceptFriend
);

router.put(
  "/block-user/:id",
  [
    param("id").isString().withMessage("id is required")
  ],
  auth,
  friendController.blockFriend
);

router.put(
  "/unblock-user/:id",
  [
    param("id").isString().withMessage("id is required")
  ],
  auth,
  friendController.unBlockFriend
);

router.delete(
  "/delete-friend/:id",
  param("id").isString().withMessage("user id is required"),
  auth,
  friendController.deleteFriend
);

router.get("/get-friends", auth, friendController.getFriends);

export default router;
