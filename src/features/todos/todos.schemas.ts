import { z } from "@hono/zod-openapi";

import { TodoListSchema, TodoSchema } from "@/swagger/schema";

export const todoIdParamsSchema = z.object({
  id: z.coerce.number().int().positive().openapi({
    param: {
      name: "id",
      in: "path",
    },
    example: 1,
  }),
});

export const createTodoBodySchema = z
  .object({
    title: z.string().min(1),
    content: z.string().min(1),
    isCompleted: z.boolean().optional(),
  })
  .openapi("CreateTodoBody");

export const updateTodoBodySchema = z
  .object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    isCompleted: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  })
  .openapi("UpdateTodoBody");

export const errorSchema = z
  .object({
    message: z.string(),
  })
  .openapi("ErrorResponse");

export { TodoListSchema, TodoSchema };
