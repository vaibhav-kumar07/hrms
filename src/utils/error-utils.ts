import { ZodSchema } from 'zod';
import { AppError } from '../errros/app-error';


export const validateSchema = (schema: ZodSchema, data: any): { isValid: boolean; errors?: Array<{ field: string; value: string }> } => {
    const result = schema.safeParse(data);

    if (!result.success) {
        const errors = result.error.errors.map((err) => ({
            field: err.path.join('.'),
            value: err.message,
        }));

        return { isValid: false, errors };
    }

    return { isValid: true };
};
export const throwBusinessError = (condition: boolean, message: string): void => {
    if (condition) {
        throw new AppError(message, 409, [], error_type.businessError);
    }
};


export const checkAndThrowError = (validationResult: { isValid: boolean; errors?: Array<{ field: string; value: string }> }): void => {
    if (!validationResult.isValid) {
        throw new AppError('Validation errors', 400, validationResult.errors, error_type.validationError);
    }
};

export enum error_type {
    validationError = "validation_Error",
    businessError = "business_Error"
}