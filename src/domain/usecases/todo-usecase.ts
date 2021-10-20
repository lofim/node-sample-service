import { Todo, TodoStatus } from '../model';
import { NotFoundError } from '../error';

import { TodoUseCasePort } from '../ports/primary';
import { TodoRepositoryPort } from '../ports/secondary';

export class TodoUseCase implements TodoUseCasePort {

    private readonly todoRepository: TodoRepositoryPort;

    constructor(todoRepository: TodoRepositoryPort) {
        this.todoRepository = todoRepository;
    }

    async getTodos(userId: string): Promise<Todo[]> {
        return this.todoRepository.listTodos(userId);
    }

    async getTodo(id: number, userId: string): Promise<Todo> {
        if (id === 10) {
            throw new Error('Cannot connect to TODO database');
        }

        const todo = await this.todoRepository.getTodoById(id, userId);
        if (!todo) {
            throw new NotFoundError('0002', `Could not find todo item with id: ${id}`);
        }

        return todo;
    }

    async createTodo(todo: any, userId: string): Promise<Todo> {
        const newTodo = { ...todo, status: TodoStatus.OPEN };

        // Idealy the transactions would happen on the repository level
        // Possibly move the state transition events there instead of service layer
        const savedTodo = await this.todoRepository.createTodo(newTodo, userId);

        return savedTodo;
    }

    async updateTodo(id: number, todoUpdate: any, userId: string): Promise<Todo> {
        const todo = await this.todoRepository.getTodoById(id, userId);
        if (!todo) {
            throw new NotFoundError('0002', `Could not find todo item with id: ${id}`);
        }

        const updatedTodo = await this.todoRepository.updateTodo(id, todoUpdate, userId);

        return updatedTodo;
    }

}
