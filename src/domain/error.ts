// TODO: Errors in domain package should not be http specific

export class BaseError extends Error {
    public readonly code: string;
    public readonly status: number; // Find/Make Http status enum

    constructor(code: string, message: string, status = 500, error?: Error) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.status = status;

        if (error) {
            this.stack = `${this.stack
                }\n\nNested stack: ${error.stack}`;
        }
    }
}

export class NotFoundError extends BaseError {
    constructor(code: string, message: string, error?: Error) {
        super(code, message, 404, error);
    }
}

export class UnauthorizedError extends BaseError {
    constructor(code: string, message: string, error?: Error) {
        super(code, message, 401, error);
    }
}
