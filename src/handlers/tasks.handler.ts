import { Request, Response } from "express";
import * as TasksService from "../services/tasks.service";
import {
  createTaskSchema,
  getTasksQuerySchema,
  taskIdParamSchema,
  updateTaskSchema,
} from "./schemas/tasks.schema";
import { get } from "node:http";

export async function listTasksHandler(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const query = getTasksQuerySchema.parse(req.query);
  const tasks = await TasksService.listTasks(userId, query);

  return res.json(tasks);
}

export async function createTaskHandler(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const data = createTaskSchema.parse(req.body);

  const task = await TasksService.createTask({
    ...data,
    userId,
  });

  return res.status(201).json(task);
}

export async function updateTaskHandler(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { id } = taskIdParamSchema.parse(req.params);
  const data = updateTaskSchema.parse(req.body);

  const task = await TasksService.updateTask(id, userId, data);
  return res.json(task);
}

export async function deleteTaskHandler(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { id } = taskIdParamSchema.parse(req.params);

  await TasksService.deleteTask(id, userId);
  return res.status(204).send();
}
