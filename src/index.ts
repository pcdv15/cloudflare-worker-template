import { todosRoutes } from "@/features/todos/todos.routes";
import { createSwaggerDocument } from "@/swagger/document";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

const app = new OpenAPIHono<{ Bindings: Cloudflare.Env }>();

app.use("/api/*", logger());

app.use("/api/*", cors());

app.doc("/doc", createSwaggerDocument());

app.get("/api/docs", swaggerUI({ url: "/doc" }));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api/todos", todosRoutes);

export default app;
