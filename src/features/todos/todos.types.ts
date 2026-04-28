export type TodoDto = {
  id: number;
  title: string;
  content: string;
  isCompleted: boolean;
  createdAt: string;
};

export type CreateTodoDto = {
  title: string;
  content: string;
  isCompleted?: boolean;
};

export type UpdateTodoDto = Partial<CreateTodoDto>;
