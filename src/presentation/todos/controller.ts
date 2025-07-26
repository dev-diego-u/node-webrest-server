import { Request, Response } from "express";

const todos = [
  { id: 1, text: "Buy milk", completedAt: new Date() },
  { id: 2, text: "Buy bread", completedAt: null },
  { id: 3, text: "Buy butter", completedAt: new Date() },
];

export class TodosController {
  //*dependencies injected
  constructor() {}

  public getTodos(req: Request, res: Response) {
    return res.json(todos);
  }

  public createTodo(req: Request, res: Response) {
    const { text, completedAt } = req.body;
    if (!text)
      res.status(400).json({
        message: "text is required",
      });
    const newTodo = {
      id: todos.length + 1,
      text: text,
      completedAt: completedAt ? new Date(completedAt) : null,
    };
    todos.push(newTodo);
    return res.json(newTodo);
  }

  public getTodoById(req: Request, res: Response) {
    const id = +req.params.id;
    // console.log(id);
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    return res.json(todo);
  }

  public updateTodo(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const { text, completedAt } = req.body;

    todo.text = text || todo.text;
    todo.completedAt = completedAt ? new Date(completedAt) : todo.completedAt;
    return res.json(todo);
  }

  public deleteTodo(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: "invalid id" });
    const index = todos.findIndex((todo) => todo.id === id);
    if (index === -1)
      return res.status(404).json({ message: "Todo not found" });

    const todoDel = todos.splice(index, 1);
    return res.status(200).json(todoDel);
  }
}
