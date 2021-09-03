import {ITodoRepository, TodoRepositoryFailure} from "../repository/ITodoRepository";
import {TodoEntity} from "../../../domain/todo/entity/TodoEntity/TodoEntity";
import {IUseCase} from "../../../abstraction/usecase/IUseCase";
import {EmptyParams} from "../../../abstraction/usecase/EmptyParams";
import {Either} from "../../../abstraction/handling/Either";

export class GetTodosUC implements IUseCase<EmptyParams, Promise<Either<TodoRepositoryFailure.EmptyRepository | TodoRepositoryFailure.UnknownError, TodoEntity[]>>> {
  constructor(private readonly todoRepository: ITodoRepository) {
  }

  async execute(params: EmptyParams): Promise<Either<TodoRepositoryFailure.EmptyRepository | TodoRepositoryFailure.UnknownError, TodoEntity[]>> {
    return this.todoRepository.getTodos();
  }
}
