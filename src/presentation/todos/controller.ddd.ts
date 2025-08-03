import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto } from "../../domain/dtos";
import { UpdateTodoDto } from "../../domain/dtos/todos/update-dto.todo";
import { TodoRepository } from "../../domain";

// const todos = [
//   { id: 1, text: "Buy milk", completedAt: new Date() },
//   { id: 2, text: "Buy bread", completedAt: null },
//   { id: 3, text: "Buy butter", completedAt: new Date() },
// ];

export class TodosController {
  //*dependencies injected
  constructor(private readonly todoRepository: TodoRepository) {}

  public getTodos = async (req: Request, res: Response) => {
    const todos = await this.todoRepository.getAll();
    return res.json(todos);
  };

  public createTodo = async (req: Request, res: Response) => {
    // const { text, completedAt } = req.body;
    const resultCreate = CreateTodoDto.create(req.body);
    if (!resultCreate.success) {
      return res.status(400).json({ error: resultCreate.error });
    }

    const newTodo = await this.todoRepository.create(resultCreate.data);
    return res.json(newTodo);
  };

  public getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    try {
      const todo = await this.todoRepository.getById(id);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    // 2. Actualizar
    const resultUpdate = UpdateTodoDto.update({ ...req.body, id });
    if (!resultUpdate.success) {
      return res.status(400).json({ error: resultUpdate.error });
    }

    const updatedTodo = await this.todoRepository.updateById(resultUpdate.data);
    return res.status(200).json(updatedTodo);
  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: "invalid id" });

    try {
      const deletedTodo = await this.todoRepository.deleteById(id);
      return res.status(200).json(deletedTodo);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  };
}
