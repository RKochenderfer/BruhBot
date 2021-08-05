const CumCounter = require('./CumCounter')

class MessageChecker {
    static #flagged_expressions = [
        {
            'regex': /[cum]/i,
            func: async (msg) => await CumCounter.Counter(msg)
        }
    ]

    /**
     *
     * @param msg {Message}
     * @constructor
     */
    static async CheckMessage(msg) {
        for (let i = 0; i < this.#flagged_expressions.length; i++) {
            const tar = this.#flagged_expressions[i]
            const regex = tar.regex

            if (regex.test(msg.content))
                await tar.func(msg)
        }
    }
}

module.exports = MessageChecker