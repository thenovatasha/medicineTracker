class ConfigError extends Error {
    constructor(message: string = "Missing Config Property") {
        super(message);
        this.name = "ConfigError";
        Object.setPrototypeOf(this, ConfigError.prototype);
    }
}