export class AppError extends Error {
    statusCode: number;
    code: string;
    details?: unknown;

    constructor(statusCode: number, code: string, message: string, details?: unknown) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}

export const badRequest = (message: string, details?: unknown) => new AppError(400, "BAD_REQUEST", message, details);
export const unauthorized = (message: string) => new AppError(401, "UNAUTHORIZED", message);
export const forbidden = (message: string) => new AppError(403, "FORBIDDEN", message);
export const notFound = (message: string) => new AppError(404, "NOT_FOUND", message);
export const internalError = (message: string, details?: unknown) => new AppError(500, "INTERNAL_ERROR", message, details);
