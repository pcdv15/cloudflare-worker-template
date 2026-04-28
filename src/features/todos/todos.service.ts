import { TodosRepository } from "./todos.repo";
import type { CreateTodoDto, TodoDto, UpdateTodoDto } from "./todos.types";

/**
 * Coordinates todo use cases and maps database rows into DTOs.
 */
export class TodosService {
  private readonly repository: TodosRepository;

  constructor(repository: TodosRepository) {
    this.repository = repository;
  }

  /**
   * Returns all todos as API-friendly DTOs.
   */
  async listTodos(d1: D1Database): Promise<TodoDto[]> {
    const todos = await this.repository.findAll(d1);

    return todos.map((todo) => this.toDto(todo));
  }

  /**
   * Returns one todo by id, or null when it does not exist.
   */
  async getTodoById(d1: D1Database, id: number): Promise<TodoDto | null> {
    const todo = await this.repository.findById(d1, id);

    return todo ? this.toDto(todo) : null;
  }

  /**
   * Creates a todo and returns the created DTO.
   */
  async createTodo(d1: D1Database, data: CreateTodoDto): Promise<TodoDto> {
    const todo = await this.repository.create(d1, data);

    return this.toDto(todo);
  }

  /**
   * Updates a todo and returns the updated DTO when found.
   */
  async updateTodo(
    d1: D1Database,
    id: number,
    data: UpdateTodoDto,
  ): Promise<TodoDto | null> {
    const todo = await this.repository.update(d1, id, data);

    return todo ? this.toDto(todo) : null;
  }

  /**
   * Deletes a todo and reports whether a record was removed.
   */
  async deleteTodo(d1: D1Database, id: number): Promise<boolean> {
    const todo = await this.repository.delete(d1, id);

    return Boolean(todo);
  }

  /**
   * Normalizes a database row into the public todo DTO shape.
   */
  private toDto(todo: {
    id: number;
    title: string;
    content: string;
    isCompleted: boolean;
    createdAt: Date | string;
  }): TodoDto {
    return {
      id: todo.id,
      title: todo.title,
      content: todo.content,
      isCompleted: todo.isCompleted,
      createdAt: this.toIsoString(todo.createdAt),
    };
  }

  /**
   * Converts a date-like value into an ISO string.
   */
  private toIsoString(value: Date | string) {
    return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
  }
}

const todosRepository = new TodosRepository();

export const todosService = new TodosService(todosRepository);
