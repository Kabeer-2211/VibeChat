import fs from "fs";
import path from "path";

import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { ApiResponse } from "./../types/ApiResponse";
import { createUser } from "./../services/auth.service";
import UserModel from "../models/User.model";

interface UserRequestBody {
  username: string;
  email: string;
  avatar: Express.Multer.File;
  password: string;
}

export async function register(
  req: Request<{}, {}, UserRequestBody>,
  res: Response<ApiResponse>
): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  try {
    const { username, email, password } = req.body;
    const avatar = req.file?.filename as string;
    const userExist = await UserModel.findOne({ email });
    let user;
    if (userExist) {
      if (!userExist.isVerified) {
        fs.unlink(
          path.join(
            __dirname,
            `/../../../src/public/avatars/${userExist.avatar}`
          ),
          () => {}
        );
        userExist.username = username;
        userExist.email = email;
        userExist.avatar = avatar;
        const hashedPassword = await UserModel.hashPassword(password);
        userExist.password = hashedPassword;
        const verifyCode = Math.floor(100000 + Math.random() * 999999);
        userExist.verifyCode = verifyCode;
        const verifiedCodeExpiry = new Date();
        verifiedCodeExpiry.setHours(verifiedCodeExpiry.getHours() + 1);
        userExist.verifiedCodeExpiry = verifiedCodeExpiry;
        user = await userExist.save();
      } else {
        res
          .status(400)
          .json({ success: false, message: "user already exists" });
        return;
      }
    } else {
      user = await createUser(username, email, avatar, password);
    }
    const token = await user.generateToken();
    res.json({
      success: true,
      message: "user created successfully",
      token,
      user,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "an error occurred" });
    return;
  }
}

export async function login(
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response<ApiResponse>
): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      res.status(404).json({ success: false, message: "user not found" });
      return;
    }
    if (!user.isVerified) {
      res.status(400).json({ success: false, message: "user not verified" });
      return;
    }
    const isCorrectPassword = await user.comparePassword(password);
    if (!isCorrectPassword) {
      res.status(400).json({ success: false, message: "incorrect password" });
      return;
    }
    const token = await user.generateToken();
    res.status(200).json({
      success: true,
      message: "user logged in successfully",
      token,
      user,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "an error occurred" });
    return;
  }
}

export async function verifyEmail(
  req: Request<{ id: string }, {}, { verifyCode: Number }>,
  res: Response<ApiResponse>
): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  try {
    const { verifyCode } = req.body;
    const { id } = req.params;
    const user = await UserModel.findById(id).select(["+verifyCode", "+verifiedCodeExpiry"]);
    if (!user) {
      res.status(400).json({ success: false, message: "user does not exist" });
      return;
    }
    if (user.isVerified) {
      res
        .status(400)
        .json({ success: false, message: "user already verified" });
      return;
    }
    if (verifyCode != user.verifyCode) {
      res
        .status(400)
        .json({ success: false, message: "Invalid verification code" });
      return;
    }
    const expiryDate = user.verifiedCodeExpiry;
    const currentDate = new Date();
    if (expiryDate < currentDate) {
      res
        .status(400)
        .json({ success: false, message: "verification code expired" });
      return;
    }
    user.isVerified = true;
    await user.save();
    const token = await user.generateToken();

    res.status(200).json({
      success: true,
      message: "user verified successfully",
      token,
      user,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "an error occurred" });
    return;
  }
}
