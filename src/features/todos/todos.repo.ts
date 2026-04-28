import { desc, eq } from "drizzle-orm";

import { getdb, todos, type DbClient } from "@/db";

import type { CreateTodoDto, UpdateTodoDto } from "./todos.types";

/**
 * Handles persistence operations for todo records.
 */
export class TodosRepository {
  /**
   * Returns all todos ordered by newest first.
   */
  findAll(d1: D1Database) {
    const db = this.getDb(d1);

    return db.select().from(todos).orderBy(desc(todos.id));
  }

  /**
   * Finds a single todo by its identifier.
   */
  async findById(d1: D1Database, id: number) {
    const db = this.getDb(d1);
    const [todo] = await db.select().from(todos).where(eq(todos.id, id));

    return todo ?? null;
  }

  /**
   * Creates a new todo record.
   */
  async create(d1: D1Database, data: CreateTodoDto) {
    const db = this.getDb(d1);
    const [todo] = await db
      .insert(todos)
      .values({
        title: data.title,
        content: data.content,
        isCompleted: data.isCompleted ?? false,
        createdAt: new Date(),
      })
      .returning();

    return todo;
  }

  /**
   * Updates an existing todo and returns the updated record.
   */
  async update(d1: D1Database, id: number, data: UpdateTodoDto) {
    const db = this.getDb(d1);
    const [todo] = await db
      .update(todos)
      .set(data)
      .where(eq(todos.id, id))
      .returning();

    return todo ?? null;
  }

  /**
   * Deletes a todo and returns the deleted record when found.
   */
  async delete(d1: D1Database, id: number) {
    const db = this.getDb(d1);
    const [todo] = await db
      .delete(todos)
      .where(eq(todos.id, id))
      .returning();

    return todo ?? null;
  }

  private getDb(d1: D1Database): DbClient {
    return getdb(d1);
  }
}
