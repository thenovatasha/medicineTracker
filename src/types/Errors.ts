export class ConfigError extends Error {
    constructor(message: string = "Missing Config Property") {
        super(message);
        this.name = "ConfigError";
        Object.setPrototypeOf(this, ConfigError.prototype);
    }
}

export class UnexpectedError extends Error {
    constructor(message: string = "unexpected error") {
        super(message);
        this.name = "UnexpectedError";
        Object.setPrototypeOf(this, UnexpectedError.prototype);
    }
}

export class DatabaseError extends Error {
    constructor(message: string = "Database error") {
        super(message);
        this.name = "Database Error";
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}

export class InsertionError extends DatabaseError {

    constructor(message: string = "Insertion error") {
        super(message);
        this.name = "Insertion Error";
        Object.setPrototypeOf(this, InsertionError.prototype);
    }
}
