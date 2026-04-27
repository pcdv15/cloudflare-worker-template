import { Hono } from "hono";

const app = new Hono<{ Bindings: Cloudflare.Env }>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
