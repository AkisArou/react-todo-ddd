import {ITodoEntityMapper} from "../mapper/TodoEntityMapper";
import {ITodoCacheModel} from "../model/ITodoCacheModel";
import {TodoEntity} from "../../../../domain/todo/entity/TodoEntity/TodoEntity";

export class CacheSaveException extends Error {
}

export class CacheEmptyException extends Error {
}

export interface ITodoLocalDataSource {
  getTodos(): Promise<TodoEntity[]>;

  saveTodos(todos: TodoEntity[]): Promise<void>;
}

export class TodoLocalDataSource implements ITodoLocalDataSource {
  private static localStorageKey = "todos";

  constructor(
    private readonly _localStorage: Storage,
    private readonly _todoEntityMapper: ITodoEntityMapper
  ) {
  }

  async getTodos(): Promise<TodoEntity[]> {
    const todos = this._localStorage.getItem(TodoLocalDataSource.localStorageKey);

    if (todos) {
      const parsedTodos = JSON.parse(todos) as ITodoCacheModel[];
      return this._todoEntityMapper.mapFrom(parsedTodos);
    } else {
      throw new CacheEmptyException();
    }
  }

  async saveTodos(todos: TodoEntity[]): Promise<void> {
    const todosToSave = this._todoEntityMapper.mapTo(todos);
    try {
      this._localStorage.setItem(TodoLocalDataSource.localStorageKey, JSON.stringify(todosToSave));
    } catch {
      throw new CacheSaveException();
    }
  }
}
