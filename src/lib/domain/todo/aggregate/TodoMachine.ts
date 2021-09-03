import {TodoEntity, TodoEntityFactory} from "../entity/TodoEntity/TodoEntity";
import {Either, right} from "../../../abstraction/handling/Either";
import {TodoNameError} from "../entity/TodoEntity/value_object/TodoName";

export interface ITodoMachine {
    setTodos(todos: TodoEntity[]): void;

    toggleTodo(todo: TodoEntity): void;

    removeTodo(todoId: number): void;

    getAllTodos(): TodoEntity[];

    addNewTodoFromName(name: string): void;
}

export class TodoMachine implements ITodoMachine {
    private todos: TodoEntity[] = [];

    removeTodo(todoId: number): void {
        this.todos = this.todos.filter(todo => todo.id !== todoId);
    }

    setTodos(todos: TodoEntity[]): void {
        this.todos = todos
    }

    toggleTodo(todo: TodoEntity): void {
        const foundTodoIdx = this.todos.findIndex(t => t.id === todo.id);
        if (foundTodoIdx === -1) return
        const newTodos = [...this.todos];
        const toggledTodo = TodoEntityFactory.toggleDone(newTodos[foundTodoIdx]);
        newTodos.splice(foundTodoIdx, 1, toggledTodo);
        this.todos = newTodos;
    }

    getAllTodos(): TodoEntity[] {
        return this.todos;
    }

    addNewTodoFromName(name: string): Either<TodoNameError, string> {
        const newTodo = TodoEntityFactory.createFromName(name);
        if (TodoEntityFactory.isValid(newTodo)) {
            this.todos = [...this.todos, newTodo];
        }

        return newTodo.name.value;
    }
}