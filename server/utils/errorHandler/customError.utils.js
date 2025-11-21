export class CustomError extends Error {
    constructor(name, data) {
        super(name);

        this.name = name;
        this.data = data;
        this.type = this.constructor.name;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
