import { UnauthorizedError } from "../libs/errors";
import { signToken } from "../libs/jwt";

const STATIC_USER = {
  userId: process.env.APP_USERNAME || "admin",
  username: process.env.APP_USERNAME || "admin",
  password: process.env.APP_PASSWORD || "password123",
};

export function login(username: string, password: string) {
  if (username !== STATIC_USER.username || password !== STATIC_USER.password) {
    throw new UnauthorizedError("INVALID_CREDENTIALS");
  }

  const token = signToken({ userId: STATIC_USER.userId });

  return { token };
}
