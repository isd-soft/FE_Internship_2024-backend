export class ValidationError extends Error {
    constructor(public status, public message) {
        super(message);
    }
}
