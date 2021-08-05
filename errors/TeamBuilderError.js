class TeamBuilderError extends Error {
    constructor(message) {
        super(message);
        this.name = "TeamBuilderValidationError"
    }
}