import { ExternalApiError } from "../libs/errors";
import * as TasksRepo from "../repositories/tasks.repository";

interface ExternalTodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export async function importTasksForUser(userId: string) {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");

  if (!response.ok) {
    throw new ExternalApiError("EXTERNAL_API_ERROR");
  }

  const todos = (await response.json()) as ExternalTodo[];

  // admin -> userId 1 en la API externa
  const externalUserId = userId === "admin" ? 1 : 0;

  const filtered = todos.filter((t) => t.userId === externalUserId).slice(0, 5);

  const imported = [];

  for (const todo of filtered) {
    const task = await TasksRepo.createTask({
      title: todo.title,
      description: "Imported task",
      userId,
    });

    // Respetamos el completed externo
    if (todo.completed) {
      await TasksRepo.updateTask(task.id, { completed: true });
    }

    imported.push({ ...task, completed: todo.completed });
  }

  return {
    imported: imported.length,
    tasks: imported,
  };
}
