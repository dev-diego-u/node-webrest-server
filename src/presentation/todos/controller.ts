import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto } from "../../domain/dtos";
import { UpdateTodoDto } from "../../domain/dtos/todos/update-dto.todo";

// const todos = [
//   { id: 1, text: "Buy milk", completedAt: new Date() },
//   { id: 2, text: "Buy bread", completedAt: null },
//   { id: 3, text: "Buy butter", completedAt: new Date() },
// ];

export class TodosController {
  //*dependencies injected
  constructor() {}

  public async getTodos(req: Request, res: Response) {
    // return res.json(todos);
    const todos = await prisma.todo.findMany();

    return res.json(todos);
  }

  public async createTodo(req: Request, res: Response) {
    // const { text, completedAt } = req.body;
    const resultCreate = CreateTodoDto.create(req.body);
    if (!resultCreate.success) {
      return res.status(400).json({ error: resultCreate.error });
    }

    const newTodo = await prisma.todo.create({
      data: resultCreate.data.toObject(),
    });
    return res.json(newTodo);
  }

  public async getTodoById(req: Request, res: Response) {
    const id = +req.params.id;
    // console.log(id);
    const todo = await prisma.todo.findUnique({
      //busca todo por id y devuelve un objeto
      where: { id },
    });
    return res.json(todo);
  }

  public async updateTodo(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    // 1. Buscar si existe
    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo no encontrado" });
    }

    // 2. Actualizar
    const resultUpdate = UpdateTodoDto.update(req.body);
    if (!resultUpdate.success) {
      return res.status(400).json({ error: resultUpdate.error });
    }
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: resultUpdate.data.toObject(),
    });
    // 3. Devolver el todo actualizado
    return res.json(updatedTodo);
  }

  public async deleteTodo(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: "invalid id" });
    // 1. Buscar si existe
    const todo = await prisma.todo.findUnique({
      where: { id },
    });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    // 2. Eliminar
    const deletedTodo = await prisma.todo.delete({
      where: { id },
    });

    return res.status(200).json(deletedTodo);
  }
}
