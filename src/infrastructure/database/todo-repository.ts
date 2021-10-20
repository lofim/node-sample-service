import { Todo } from '../../domain/model';
import { TodoRepositoryPort } from '../../domain/ports/secondary';
import { Knex } from 'knex';

const todoAttributes = ['id', 'status', 'description'];
const TABLE_NAME = 'todos';

interface TodoEntity extends Todo {
    created_at: string,
    updated_at: string,
    user_id: string,
}

export class TodoRepository implements TodoRepositoryPort {

    private readonly databaseClient: Knex;

    constructor(databaseClient: Knex) {
        this.databaseClient = databaseClient;
    }

    async listTodos(userId: string): Promise<Todo[]> {
        return this.databaseClient<TodoEntity>(TABLE_NAME)
            .select(todoAttributes)
            .where({ user_id: userId }) as any;
    }

    async getTodoById(id: number, userId: string): Promise<Todo> {
        const todos: any = await this.databaseClient<TodoEntity>(TABLE_NAME)
            .select(todoAttributes)
            .where({ id, user_id: userId });

        return todos[0];
    }

    async createTodo(todo: Todo, userId: string): Promise<Todo> {
        const todos: Todo[] = await this.databaseClient<TodoEntity>(TABLE_NAME)
            .returning(todoAttributes)
            .insert({
                status: todo.status,
                description: todo.description,
                user_id: userId,
                created_at: this.databaseClient.fn.now(),
            });

        return todos[0];
    }

    async updateTodo(id: number, todo: Todo, userId: string): Promise<Todo> {
        const { description, status } = todo;

        const todos: any = await this.databaseClient<TodoEntity>(TABLE_NAME)
            .returning(todoAttributes)
            .update({
                description,
                status,
                updated_at: this.databaseClient.fn.now(),
            })
            .where({ id, user_id: userId });

        return todos[0];
    }

}
