import React, {useState} from "react";
import styles from "./TodoScreen.module.css";
import {useStore} from "educe";
import {StoreManager} from "../../application/shared/store/StoreManager";
import {TodoNameError} from "../../domain/todo/entity/TodoEntity/value_object/TodoName";
import {assertUnreachable} from "../../abstraction/helper/assertUnreachable";
import {TodoVisibility} from "../../application/todo/store/TodoStore";

export const TodoScreen: React.FC = () => {
    const todoStore = StoreManager.instance.getTodoStore();
    const {todos, error, nameError, todoVisibility} = useStore(todoStore, null, true);

    const [newTodoName, setTodoName] = useState("");

    const renderTodos = () => (
        todos.map(todo => (
            <li key={todo.id} className={styles.TodoItem}>
                <h5 style={{textDecoration: todo.done ? "line-through" : "initial"}}>
                    {todo.name.value.getOrCrash()}
                </h5>
                <input type="checkbox" checked={todo.done} onChange={_ => todoStore.onTodoToggled(todo)}/>
                <button onClick={_ => todoStore.onTodoRemoved(todo)}>REMOVE</button>
            </li>
        ))
    );

    const onAddTodoClicked = async (evt: React.FormEvent) => {
        evt.preventDefault();
        await todoStore.onNewTodoNameArrived(newTodoName);
        setTodoName("");
    }

    const renderNameError = () => {
        switch (nameError) {
            case TodoNameError.LongName:
                return <h5 className={styles.Error}>Long name! Cannot save!</h5>
            case TodoNameError.ShortName:
                return <h5 className={styles.Error}>Short name! Cannot save!</h5>
            case null:
                return null;
            default:
                assertUnreachable(nameError);
        }
    }

    const getVisibilityButtonClassName = (isSelected: boolean) => isSelected ? styles.SelectedVisibility : "";

    return (
        <div className={styles.TodoScreen}>
            <h1>Todos application</h1>
            <div className={styles.VisibilityButtonContainer}>
                <button className={getVisibilityButtonClassName(todoVisibility === TodoVisibility.All)}
                        onClick={() => todoStore.onTodoVisibilityChanged(TodoVisibility.All)}
                >
                    Show all
                </button>
                <button className={getVisibilityButtonClassName(todoVisibility === TodoVisibility.Pending)}
                        onClick={() => todoStore.onTodoVisibilityChanged(TodoVisibility.Pending)}
                >
                    Show pending
                </button>
            </div>
            {error && <h5 className={styles.Error}>{error}</h5>}
            {renderNameError()}

            <form onSubmit={onAddTodoClicked}>
                <input type="text" value={newTodoName} onChange={event => setTodoName(event.target.value)} style={{marginRight: ".5rem"}}/>
                <button type="submit">Add todo</button>
            </form>

            <ul className={styles.TodoList}>
                {renderTodos()}
                {todos.length === 0 && <h5>No todos to show!</h5>}
            </ul>
        </div>
    )
};