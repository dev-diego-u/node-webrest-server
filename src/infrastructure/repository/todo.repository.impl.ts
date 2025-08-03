import {
  CreateTodoDto,
  TodoDataSource,
  TodoEntity,
  TodoRepository,
  UpdateTodoDto,
} from "../../domain";

export class TodoRepositoryImpl implements TodoRepository {
  constructor(private readonly todoDataSource: TodoDataSource) {}
  create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    return this.todoDataSource.create(createTodoDto);
  }
  getAll(): Promise<TodoEntity[]> {
    return this.todoDataSource.getAll();
  }
  getById(id: number): Promise<TodoEntity> {
    return this.todoDataSource.getById(id);
  }
  updateById(UpdateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    return this.todoDataSource.updateById(UpdateTodoDto);
  }
  deleteById(id: number): Promise<TodoEntity> {
    return this.todoDataSource.deleteById(id);
  }
}
