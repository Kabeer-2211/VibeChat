import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import UserModel from "../models/User.model";

export async function auth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Unauthorized");
    }
    const decoded = (await jwt.verify(
      token,
      process.env.JWT_SECRET as string
    )) as JwtPayload;
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
    return;
  } catch (err) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
}
