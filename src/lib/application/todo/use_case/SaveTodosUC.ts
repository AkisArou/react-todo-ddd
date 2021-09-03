import {ITodoRepository, TodoRepositoryFailure} from "../repository/ITodoRepository";
import {TodoEntity} from "../../../domain/todo/entity/TodoEntity/TodoEntity";
import {IUseCase} from "../../../abstraction/usecase/IUseCase";
import {Either} from "../../../abstraction/handling/Either";

export class SaveTodosParams {
  constructor(public todos: TodoEntity[]) {
  }
}


export class SaveTodosUC implements IUseCase<SaveTodosParams, Promise<Either<TodoRepositoryFailure.ErrorPersisting, null>>> {
  constructor(private readonly todoRepository: ITodoRepository) {
  }

  async execute(params: SaveTodosParams): Promise<Either<TodoRepositoryFailure.ErrorPersisting, null>> {
    return await this.todoRepository.saveTodos(params.todos);
  }
}
