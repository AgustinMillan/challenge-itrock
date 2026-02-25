import { Router } from "express";
import {
  listTasksHandler,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
} from "../handlers/tasks.handler";
import { importTasksHandler } from "../handlers/import.handler";
import { authMiddleware } from "../middlewares/auth.middleware";

// ...

const router = Router();

router.use(authMiddleware);

router.get("/", listTasksHandler);
router.post("/", createTaskHandler);
router.patch("/:id", updateTaskHandler);
router.delete("/:id", deleteTaskHandler);
router.post("/import", importTasksHandler);

export default router;
