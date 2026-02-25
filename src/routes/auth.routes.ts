import { Router } from "express";
import { loginHandler } from "../handlers/auth.handler";

const router = Router();

router.post("/login", loginHandler);

export default router;
