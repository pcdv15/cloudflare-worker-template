import { OpenAPIHono, createRoute } from "@hono/zod-openapi";

import {
  createTodoBodySchema,
  errorSchema,
  TodoListSchema,
  TodoSchema,
  todoIdParamsSchema,
  updateTodoBodySchema,
} from "./todos.schemas";
import { todosService } from "./todos.service";

const todosRoutes = new OpenAPIHono<{ Bindings: Cloudflare.Env }>();

const listTodosRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Todos"],
  responses: {
    200: {
      description: "List all todos",
      content: {
        "application/json": {
          schema: TodoListSchema,
        },
      },
    },
  },
});

const getTodoRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Todos"],
  request: {
    params: todoIdParamsSchema,
  },
  responses: {
    200: {
      description: "Todo found",
      content: {
        "application/json": {
          schema: TodoSchema,
        },
      },
    },
    404: {
      description: "Todo not found",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
  },
});

const createTodoRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Todos"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: createTodoBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Todo created",
      content: {
        "application/json": {
          schema: TodoSchema,
        },
      },
    },
  },
});

const updateTodoRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["Todos"],
  request: {
    params: todoIdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: updateTodoBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Todo updated",
      content: {
        "application/json": {
          schema: TodoSchema,
        },
      },
    },
    404: {
      description: "Todo not found",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
  },
});

const deleteTodoRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Todos"],
  request: {
    params: todoIdParamsSchema,
  },
  responses: {
    204: {
      description: "Todo deleted",
    },
    404: {
      description: "Todo not found",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
  },
});

todosRoutes.openapi(listTodosRoute, async (c) => {
  const todos = await todosService.listTodos(c.env.DB);

  return c.json(todos, 200);
});

todosRoutes.openapi(getTodoRoute, async (c) => {
  const { id } = c.req.valid("param");
  const todo = await todosService.getTodoById(c.env.DB, id);

  if (!todo) {
    return c.json({ message: "Todo not found" }, 404);
  }

  return c.json(todo, 200);
});

todosRoutes.openapi(createTodoRoute, async (c) => {
  const body = c.req.valid("json");
  const todo = await todosService.createTodo(c.env.DB, body);

  return c.json(todo, 201);
});

todosRoutes.openapi(updateTodoRoute, async (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");
  const todo = await todosService.updateTodo(c.env.DB, id, body);

  if (!todo) {
    return c.json({ message: "Todo not found" }, 404);
  }

  return c.json(todo, 200);
});

todosRoutes.openapi(deleteTodoRoute, async (c) => {
  const { id } = c.req.valid("param");
  const deleted = await todosService.deleteTodo(c.env.DB, id);

  if (!deleted) {
    return c.json({ message: "Todo not found" }, 404);
  }

  return c.body(null, 204);
});

export { todosRoutes };
