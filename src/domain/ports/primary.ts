import { Todo } from '../model';

export interface TodoUseCasePort {
    getTodos(userId: string): Promise<Todo[]>,
    getTodo(id: number, userId: string): Promise<Todo>,
    createTodo(todo: any, userId: string): Promise<Todo>,
    updateTodo(id: number, todoUpdate: any, userId: string): Promise<Todo>,
}
