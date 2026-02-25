import * as Repo from "../repositories/tasks.repository";
import { NotFoundError, ForbiddenError, BadRequestError } from "../libs/errors";

export type GetTasksFilters = {
  page: number;
  limit: number;
  completed?: boolean;
  from?: string;
  to?: string;
};

export async function updateTask(
  id: string,
  userId: string,
  input: Partial<{ title: string; description: string; completed: boolean }>,
) {
  if (Object.keys(input).length === 0) {
    throw new BadRequestError("Nothing to update");
  }

  const task = await Repo.findTaskById(id);
  if (!task) throw new NotFoundError("Task not found");
  if (task.userId !== userId) throw new ForbiddenError("Forbidden");

  return Repo.updateTask(id, input);
}

export async function deleteTask(id: string, userId: string) {
  const task = await Repo.findTaskById(id);
  if (!task) throw new NotFoundError("Task not found");
  if (task.userId !== userId) throw new ForbiddenError("Forbidden");

  await Repo.deleteTask(id);
}

export async function listTasks(userId: string, query: GetTasksFilters) {
  const { data, total } = await Repo.findTasksByUser(userId, query);

  const page = query.page ?? 1;
  const limit = query.limit ?? 10;

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function createTask(input: {
  title: string;
  description: string;
  userId: string;
}) {
  return Repo.createTask(input);
}
