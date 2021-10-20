import { Todo } from '../model';

export interface TodoRepositoryPort {
    listTodos(userId: string): Promise<Todo[]>,
    getTodoById(id: number, userId: string): Promise<Todo>,
    createTodo(todo: Todo, userId: string): Promise<Todo>,
    updateTodo(id: number, todo: Todo, userId: string): Promise<Todo>,
}
