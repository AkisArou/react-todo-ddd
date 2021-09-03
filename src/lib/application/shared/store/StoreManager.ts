import {TodoStore} from "../../todo/store/TodoStore";
import {TodoMachine} from "../../../domain/todo/aggregate/TodoMachine";
import {GetTodosUC} from "../../todo/use_case/GetTodosUC";
import {SaveTodosUC} from "../../todo/use_case/SaveTodosUC";
import {TodoRepositoryImpl} from "../../../infrastructure/todo/persistence/TodoRepositoryImpl";
import {TodoLocalDataSource} from "../../../infrastructure/todo/persistence/data_source/TodoLocalDataSource";
import {TodoEntityMapper} from "../../../infrastructure/todo/persistence/mapper/TodoEntityMapper";

export class StoreManager {
    public static readonly instance = new StoreManager();

    private readonly todoStore = new TodoStore(
        new TodoMachine(),
        new GetTodosUC(new TodoRepositoryImpl(new TodoLocalDataSource(localStorage, new TodoEntityMapper()))),
        new SaveTodosUC(new TodoRepositoryImpl(new TodoLocalDataSource(localStorage, new TodoEntityMapper()))),
    );

    public getTodoStore(): TodoStore {
        return this.todoStore;
    }
}