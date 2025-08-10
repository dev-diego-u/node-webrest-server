import { prisma } from "../../data/postgres";
import {
  CreateTodoDto,
  CustomError,
  TodoDataSource,
  TodoEntity,
  UpdateTodoDto,
} from "../../domain";

export class TodoDatasourceImpl implements TodoDataSource {
  async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    const todo = await prisma.todo.create({
      data: createTodoDto.toObject(),
    });

    return TodoEntity.fromObject(todo);
  }
  async getAll(): Promise<TodoEntity[]> {
    // throw new Error("Method not implemented.");
    const todos = await prisma.todo.findMany();
    return todos.map((todo) => TodoEntity.fromObject(todo));
  }
  async getById(id: number): Promise<TodoEntity> {
    // throw new Error("Method not implemented.");
    const todo = await prisma.todo.findUnique({
      //busca todo por id y devuelve un objeto
      where: { id },
    });
    if (!todo) {
      throw new CustomError(`Todo with id ${id} not found`, 404);
    }
    return TodoEntity.fromObject(todo);
  }
  async updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    // throw new Error("Method not implemented.");
    await this.getById(updateTodoDto.id);
    const updatedTodo = await prisma.todo.update({
      where: { id: updateTodoDto.id },
      data: updateTodoDto.toObject(),
    });
    return TodoEntity.fromObject(updatedTodo);
  }

  async deleteById(id: number): Promise<TodoEntity> {
    // throw new Error("Method not implemented.");
    await this.getById(id);
    const deletedTodo = await prisma.todo.delete({
      where: { id },
    });
    return TodoEntity.fromObject(deletedTodo);
  }
}
