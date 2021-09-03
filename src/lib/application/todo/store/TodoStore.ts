import {TodoEntity} from "../../../domain/todo/entity/TodoEntity/TodoEntity";
import {Store} from "educe";
import {TodoMachine} from "../../../domain/todo/aggregate/TodoMachine";
import {GetTodosUC} from "../use_case/GetTodosUC";
import {SaveTodosParams, SaveTodosUC} from "../use_case/SaveTodosUC";
import {EmptyParams} from "../../../abstraction/usecase/EmptyParams";
import {TodoNameError} from "../../../domain/todo/entity/TodoEntity/value_object/TodoName";

interface ITodoStoreState {
    todos: TodoEntity[];
    //TODO not string but the enum, then in the UI switch it to render appropriate localized message
    error: string | null;
    nameError: TodoNameError | null;
    todoVisibility: TodoVisibility;
}

export enum TodoVisibility {
    All,
    Pending
}

export class TodoStore extends Store<ITodoStoreState> {
    protected state: ITodoStoreState = {
        todos: [],
        error: null,
        nameError: null,
        todoVisibility: TodoVisibility.All
    }

    constructor(
        private todoMachine: TodoMachine,
        private getTodosUC: GetTodosUC,
        private saveTodosUC: SaveTodosUC
    ) {
        super();
    }

    async requestEffect() {
        await this.fetchTodos();
    }

    private async fetchTodos(): Promise<void> {
        const todos = await this.getTodosUC.execute(new EmptyParams());

        todos.fold(
            todos => {
                this.todoMachine.setTodos(todos);
                this.setState({todos: this.todoMachine.getAllTodos()});
            },
            err => {
                this.setState({error: "Error fetching todos"});
            });
    }

    private showAppropTodos(todoVisibility: TodoVisibility): void {
        const todos = todoVisibility === TodoVisibility.All
            ? this.todoMachine.getAllTodos()
            : this.todoMachine.getAllTodos().filter(todo => !todo.done);

        this.setState({todos, error: null});
    }

    private async saveTodos(): Promise<void> {
        const todos = this.todoMachine.getAllTodos();
        this.setState({error: null, nameError: null});

        const saveResult = await this.saveTodosUC.execute(new SaveTodosParams(todos));
        saveResult.fold(
            value => {
                this.showAppropTodos(this.state.todoVisibility);
            },
            err => {
                this.setState({error: "Error saving todos"});
            });
    }

    public async onTodoToggled(todo: TodoEntity): Promise<void> {
        this.todoMachine.toggleTodo(todo);
        await this.saveTodos();
    }

    public async onTodoRemoved(todo: TodoEntity): Promise<void> {
        this.todoMachine.removeTodo(todo.id);
        await this.saveTodos();
    }

    public async onNewTodoNameArrived(todoName: string): Promise<void> {
        const result = this.todoMachine.addNewTodoFromName(todoName);

        await result.fold(
            async _ => {
                await this.saveTodos();
            },
            async err => {
                this.setState({nameError: err});
            }
        )
    }

    public onTodoVisibilityChanged(todoVisibility: TodoVisibility): void {
        this.setState({todoVisibility});
        this.showAppropTodos(todoVisibility);
    }
}