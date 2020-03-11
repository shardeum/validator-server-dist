export declare class ValidationError extends Error {
    message: string;
    key?: string | undefined;
    name: string;
    constructor(message: string, key?: string | undefined);
}
