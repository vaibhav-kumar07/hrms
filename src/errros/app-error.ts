export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    errors: Array<{ field: string; value: string }> | string[];
    error_type: string;

    constructor(
        message: string,
        statusCode: number = 500,
        errors: Array<{ field: string; value: string }> | string[] = [],
        error_type: string
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.errors = errors;
        this.error_type = error_type;  // Set the error type

        Error.captureStackTrace(this, this.constructor);
    }
}
