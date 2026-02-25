import { Request, Response } from "express";
import { ZodError } from "zod";
import { loginSchema } from "./schemas/auth.schema";
import * as AuthService from "../services/auth.service";

export async function loginHandler(req: Request, res: Response) {
  const { username, password } = loginSchema.parse(req.body);

  const result = AuthService.login(username, password);
  return res.json(result);
}
