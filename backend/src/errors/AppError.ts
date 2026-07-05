export class AppError extends Error {
    readonly statusCode: number;
    readonly code?: string;
    readonly isOperational: boolean;

    constructor(
        statusCode: number,
        message: string,
        code?: string,
        isOperational = true
    ) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string, code?: string) {
        super(400, message, code);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized", code?: string) {
        super(401, message, code);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Not found", code?: string) {
        super(404, message, code);
    }
}

export class ConflictError extends AppError {
    constructor(message: string, code?: string) {
        super(409, message, code);
    }
}
