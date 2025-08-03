import { Router } from "express";
import { TodosController } from "./controller";
import { TodoDatasourceImpl } from "../../infrastructure/datasource/todo.datasource.impl";
import { TodoRepositoryImpl } from "../../infrastructure/repository/todo.repository.impl";

export class TodoRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new TodoDatasourceImpl();
    const todoRepository = new TodoRepositoryImpl(datasource);

    // Define your routes here
    const todosController = new TodosController(todoRepository);
    router.get("/", todosController.getTodos);
    router.post("/", todosController.createTodo); // Assuming you want to handle POST requests as well
    router.get("/:id", todosController.getTodoById);
    router.put("/:id", todosController.updateTodo); // Assuming you want to handle PUT requests as well
    router.delete("/:id", todosController.deleteTodo);

    return router;
  }
}
