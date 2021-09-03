import {ITodoRepository, TodoRepositoryFailure} from "../../../application/todo/repository/ITodoRepository";
import {TodoEntity} from "../../../domain/todo/entity/TodoEntity/TodoEntity";
import {CacheEmptyException, CacheSaveException, ITodoLocalDataSource} from "./data_source/TodoLocalDataSource";
import {Either, left, right} from "../../../abstraction/handling/Either";

export class TodoRepositoryImpl implements ITodoRepository {

  constructor(
    private readonly todoLocalDataSource: ITodoLocalDataSource
  ) {
  }


  async getTodos(): Promise<Either<TodoRepositoryFailure.EmptyRepository | TodoRepositoryFailure.UnknownError, TodoEntity[]>> {
    try {
      return right(await this.todoLocalDataSource.getTodos());
    } catch (e) {
      if (e instanceof CacheEmptyException) {
        return left(TodoRepositoryFailure.EmptyRepository);
      } else {
        return left(TodoRepositoryFailure.UnknownError)
      }
    }
  }

  async saveTodos(todos: TodoEntity[]): Promise<Either<TodoRepositoryFailure.ErrorPersisting, null>> {
    try {
      await this.todoLocalDataSource.saveTodos(todos);
      return right(null);
    } catch (e) {
      return left(TodoRepositoryFailure.ErrorPersisting);
    }
  }
}
