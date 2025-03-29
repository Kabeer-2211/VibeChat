import UserModel, { User } from "../models/User.model";

export async function createUser(
  username: string,
  email: string,
  avatar: string,
  password: string,
  bio?: string,
): Promise<User> {
  if (!username || !email || !password) {
    throw new Error("all fields are required");
  }
  const hashedPassword = await UserModel.hashPassword(password);
  const verifyCode = Math.floor(100000 + Math.random() * 900000);
  const verifiedCodeExpiry = new Date();
  verifiedCodeExpiry.setHours(verifiedCodeExpiry.getHours() + 1);
  const user = await UserModel.create({
    username,
    email,
    avatar,
    bio,
    password: hashedPassword,
    verifyCode,
    verifiedCodeExpiry,
  });
  return user;
}
