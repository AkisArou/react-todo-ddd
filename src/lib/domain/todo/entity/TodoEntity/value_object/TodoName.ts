import {Either, left, right} from "../../../../../abstraction/handling/Either";

export enum TodoNameError {
  LongName,
  ShortName
}

export interface TodoName {
  readonly value: Either<TodoNameError, string>;
}

// Validation
function validateTodoName(value: string): Either<TodoNameError, string> {
  if (value.length >= 10) {
    return left(TodoNameError.LongName)
  } else if (value.length === 0) {
    return left(TodoNameError.ShortName)
  } else {
    return right(value);
  }
}

// Creation
export class TodoNameFactory {
  public static create(value: string): TodoName {
    return {value: validateTodoName(value)};
  }
}


