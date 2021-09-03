import {Either} from "../../../abstraction/handling/Either";
import {TodoEntity} from "../../../domain/todo/entity/TodoEntity/TodoEntity";

export enum TodoRepositoryFailure {
  ErrorPersisting,
  EmptyRepository,
  UnknownError
}


export interface ITodoRepository {
  saveTodos(todos: TodoEntity[]): Promise<Either<TodoRepositoryFailure.ErrorPersisting, null>>;

  getTodos(): Promise<Either<TodoRepositoryFailure.EmptyRepository | TodoRepositoryFailure.UnknownError, TodoEntity[]>>;
}
