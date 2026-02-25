import { ZodSchema } from "zod";
import { Request } from "express";

export function validate<T>(schema: ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}
