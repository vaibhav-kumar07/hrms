import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errros/app-error';

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error_type: err.errors && typeof err.errors === 'object' ? 'validation_error' : 'business_error',
            message: err.message,
            errors: err.errors || null,
        });
    } else {
        res.status(500).json({
            error_type: 'server_error',
            message: 'An unexpected error occurred',
        });
    }
};
