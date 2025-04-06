import { Router } from "express";
import { body, param } from "express-validator";

import { auth } from "../middleware/Auth.middleware";
import * as friendController from "../controllers/Friend.controller";

const router = Router();

router.post(
  "/change-status",
  [
    body("friendId").isString().withMessage("Friend id is required"),
    body("status").optional({
      values: "falsy",
    }),
  ],
  auth,
  friendController.changeFriendStatus
);

router.delete(
  "/delete-friend/:id",
  param("id").isString().withMessage("user id is required"),
  auth,
  friendController.deleteFriend
);

router.get("/get-friends", auth, friendController.getFriends);

export default router;
