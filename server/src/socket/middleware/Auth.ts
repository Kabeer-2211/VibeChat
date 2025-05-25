import jwt, { JwtPayload } from "jsonwebtoken";
import { ExtendedError, Socket } from "socket.io";

import UserModel from "../../models/User.model";

export async function auth(
  socket: Socket,
  next: (err?: ExtendedError) => void
) {
  try {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.authorization?.split(" ")[1];
    if (!token) {
      return next(new Error("Authentication error"));
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    if (!decoded) {
      return next(new Error("Authentication error"));
    }
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return next(new Error("Authentication error"));
    }
    socket.user = user;
    next();
  } catch (err) {
    const error = err as ExtendedError;
    return next(error);
  }
}
