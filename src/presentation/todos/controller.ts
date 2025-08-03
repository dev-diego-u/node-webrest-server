import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto } from "../../domain/dtos";
import { UpdateTodoDto } from "../../domain/dtos/todos/update-dto.todo";
import {
  CreateTodo,
  DeleteTodo,
  GetTodo,
  GetTodos,
  TodoRepository,
  UpdateTodo,
} from "../../domain";

// const todos = [
//   { id: 1, text: "Buy milk", completedAt: new Date() },
//   { id: 2, text: "Buy bread", completedAt: null },
//   { id: 3, text: "Buy butter", completedAt: new Date() },
// ];

export class TodosController {
  //*dependencies injected
  constructor(private readonly todoRepository: TodoRepository) {}

  public getTodos = (req: Request, res: Response) => {
    new GetTodos(this.todoRepository)
      .execute()
      .then((todos) => res.json(todos))
      .catch((error) => {
        // console.error("Error fetching todos:", error);
        res.status(400).json({ error: error.message });
      });
  };

  public getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    new GetTodo(this.todoRepository)
      .execute(id)
      .then((todo) => res.json(todo))
      .catch((error) => {
        // console.error("Error fetching todo:", error);
        res.status(404).json({ error: error.message });
      });
  };

  public createTodo = (req: Request, res: Response) => {
    const result = CreateTodoDto.create(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const createTodoDto = result.data;

    new CreateTodo(this.todoRepository)
      .execute(createTodoDto)
      .then((todo) => res.status(201).json(todo))
      .catch((error) => {
        // console.error("Error creating todo:", error);
        res.status(400).json({ error: error.message });
      });
  };

  public updateTodo = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    // 2. Actualizar
    const resultUpdate = UpdateTodoDto.update({ ...req.body, id });
    if (!resultUpdate.success) {
      return res.status(400).json({ error: resultUpdate.error });
    }
    const updateTodoDto = resultUpdate.data;
    new UpdateTodo(this.todoRepository)
      .execute(updateTodoDto)
      .then((todo) => res.status(200).json(todo))
      .catch((error) => {
        // console.error("Error updating todo:", error);
        res.status(404).json({ error: error.message });
      });
  };

  public deleteTodo = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: "invalid id" });

    new DeleteTodo(this.todoRepository)
      .execute(id)
      .then((todo) => res.status(200).json(todo))
      .catch((error) => {
        // console.error("Error deleting todo:", error);
        res.status(404).json({ error: error.message });
      });
  };
}
