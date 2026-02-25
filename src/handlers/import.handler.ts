import { Request, Response } from "express";
import { importTasksForUser } from "../services/import.service";

export async function importTasksHandler(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const result = await importTasksForUser(userId);

  return res.status(201).json(result);
}
