import { CustomError } from "./customError.utils.js";

export class AuthError extends CustomError {
    constructor(name, data = {}) {
        super(name, { ...data, code: data?.code || 401 });
    }
}

export class ValidationError extends CustomError {
    constructor(name, data = {}) {
        super(name, { ...data, code: data?.code || 400 });
    }
}

export class DatabaseError extends CustomError {
    constructor(name, data = {}) {
        super(name, { ...data, code: data?.code || 500 });
    }
}

export class NotFoundError extends CustomError {
    constructor(name, data = {}) {
        super(name, { ...data, code: data?.code || 404 });
    }
}

export class InternalServerError extends CustomError {
    constructor(name, data = {}) {
        super(name, { ...data, code: data?.code || 500 });
    }
}
