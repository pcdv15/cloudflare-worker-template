import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: int("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isCompleted: int("is_completed", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: int("created_at", { mode: "timestamp" })
    .notNull()
    .default(new Date()),
});
