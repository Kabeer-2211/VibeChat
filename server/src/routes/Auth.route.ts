import path from "path";

import { Router } from "express";
import { body } from "express-validator";
import multer from "multer";

import { auth } from "./../middleware/Auth.middleware";

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

const upload = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
      return cb(new Error("Only JPG, JPEG, or PNG files are allowed"));
    }
    cb(null, true);
  },
});

router.post(
  "/register",
  upload.single("avatar"),
  [body("username")
    .isString()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
  body("bio")
    .optional()
    .isLength({ min: 10 })
    .withMessage("bio must be at least 10 characters"),
  body("email").isEmail().withMessage("Email is required"),
  body("password")
    .isString()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")],
  AuthControllers.register
);

router.post(
  "/login",
  [body("email").isEmail().withMessage("Email is required"),
  body("password")
    .isString()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")],
  AuthControllers.login
);

router.post(
  "/verify-email/:id",
  [body("verifyCode")
    .isInt()
    .withMessage("Verification code is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("Verification code must be 6 characters long")],
  AuthControllers.verifyEmail
);

router.post(
  "/change-password",
  [body("password")
    .isString()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("new_password")
    .isString()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("New Password must be at least 8 characters")],
  auth,
  AuthControllers.changePassword
);

// router.post(
//   "/update-user-info",
//   upload.single("avatar"),
//   body("username")
//     // .isString()
//     // .withMessage("Password is required")
//     .isLength({ min: 3 })
//     .withMessage("Username must be at least 3 characters"),
//   auth,
//   AuthControllers.changePassword
// );

router.get("/user/profile", auth, AuthControllers.getUserProfile);

export default router;
