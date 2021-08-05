class CumCounterError extends Error {
    constructor(message) {
        super(message);
        this.name = "CumCounterError"
    }
}

module.exports = CumCounterError