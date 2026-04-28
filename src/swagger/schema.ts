import { z } from "@hono/zod-openapi";

export const TodoSchema = z
  .object({
    id: z.number().int(),
    title: z.string(),
    content: z.string(),
    isCompleted: z.boolean(),
    createdAt: z.string(),
  })
  .openapi("Todo");

export const TodoListSchema = z.array(TodoSchema).openapi("TodoList");
