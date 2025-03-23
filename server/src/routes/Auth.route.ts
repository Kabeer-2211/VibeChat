import { Router } from "express";
import { body } from "express-validator";
import multer from "multer";

import * as AuthControllers from "./../controllers/Auth.controller";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/avatars");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${Date.now()}-${Math.floor(Math.random() * 100000)}-${file.originalname}`
    );
  },
});

const upload = multer({ storage });

router.post(
  "/register",
  upload.single("avatar"),
  body("username")
    .isString()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
  body("email").isEmail().withMessage("Email is required"),
  body("password")
    .isString()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  AuthControllers.register
);

router.post(
  "/login",
  body("email").isEmail().withMessage("Email is required"),
  body("password")
    .isString()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  AuthControllers.login
);

export default router;
