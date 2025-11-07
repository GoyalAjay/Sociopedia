export class CustomError extends Error {
    constructor(name, data) {
        this.name = name;
        this.data = data;
        this.type = this.constructor.name;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
