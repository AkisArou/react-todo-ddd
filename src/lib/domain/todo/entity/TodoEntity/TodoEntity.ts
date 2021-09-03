import {TodoName, TodoNameFactory} from "./value_object/TodoName";
import {IEntity} from "../../../../abstraction/data/IEntity";

export interface TodoEntity extends IEntity<number> {
  readonly name: TodoName;
  readonly done: boolean;
}

export class TodoEntityFactory {
  public static create(id: number, name: string, done: boolean): TodoEntity {
    return {
      id,
      name: TodoNameFactory.create(name),
      done,
    };
  }

  public static createFromName(name: string): TodoEntity {
    return {
      id: Date.now(),
      name: TodoNameFactory.create(name),
      done: false
    }
  }

  public static toggleDone(todo: TodoEntity): TodoEntity {
    return {...todo, done: !todo.done};
  }
  
  public static changeName(todo: TodoEntity, name: string): TodoEntity {
    return {...todo, name: TodoNameFactory.create(name)}
  }

  public static isValid(todo: TodoEntity): boolean {
    return todo.name.value.isRight();
  }
}
