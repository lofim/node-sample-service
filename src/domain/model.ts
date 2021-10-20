export interface Todo {
    id: number,
    status: TodoStatus,
    description: string
}

export enum TodoStatus {
    OPEN = 'open',
    CLOSED = 'closed'
}
